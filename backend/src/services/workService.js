const workRepository = require('../repositories/workRepository');
const blockchainService = require('./blockchainService');

// Inicializar blockchain service cuando se carga el módulo
blockchainService.initialize()
  .then(() => {
    console.log('✅ Blockchain service inicializado correctamente');
  })
  .catch((error) => {
    console.error('❌ Error inicializando blockchain service:', error.message);
    console.log('⚠️  Continuando sin blockchain service...');
  });

const createWork = async (workData, userId = null) => {
  try {
    // Validaciones
    if (!workData.worker) {
      throw new Error('Worker address is required');
    }
    if (!workData.amount || workData.amount <= 0) {
      throw new Error('Amount must be greater than 0');
    }
    if (!workData.title || workData.title.trim() === '') {
      throw new Error('Title is required');
    }
    if (!workData.description || workData.description.trim() === '') {
      throw new Error('Description is required');
    }
    if (!workData.deadline) {
      throw new Error('Deadline is required');
    }

    // Validar deadline
    if (workData.deadline < Date.now() / 1000) {
      throw new Error('Deadline must be in the future');
    }

    console.log('🚀 Creando trabajo en blockchain...');

    // Crear trabajo en blockchain
    const blockchainResult = await blockchainService.createWork(
      workData.worker,
      workData.amount,
      workData.title,
      workData.description,
      workData.deadline
    );

    console.log('✅ Trabajo creado en blockchain:', blockchainResult.workId);

    // Guardar en base de datos local
    const dbWorkData = {
      clientId: userId, // Usuario autenticado
      workerId: null,
      clientAddress: workData.clientAddress || '0x0000000000000000000000000000000000000000', // TODO: Obtener del token JWT
      workerAddress: workData.worker,
      amount: workData.amount,
      title: workData.title,
      description: workData.description,
      statusId: 0, // 0 = Created
      createdAt: Math.floor(Date.now() / 1000),
      deadline: workData.deadline,
      deliveryData: null,
      blockchainWorkId: blockchainResult.workId,
      transactionHash: blockchainResult.transactionHash
    };

    return new Promise((resolve, reject) => {
      workRepository.createWork(dbWorkData, (err, work) => {
        if (err) {
          console.error('❌ Error guardando trabajo en BD:', err);
          reject(err);
        } else {
          console.log('✅ Trabajo guardado en base de datos:', work.id);
          resolve({
            ...work,
            blockchainWorkId: blockchainResult.workId,
            transactionHash: blockchainResult.transactionHash
          });
        }
      });
    });

  } catch (error) {
    console.error('❌ Error en createWork service:', error);
    throw error;
  }
};

const getWork = (workId) => {
  return new Promise((resolve, reject) => {
    workRepository.getWorkById(workId, (err, work) => {
      if (err) return reject(err);
      if (!work) return reject(new Error('Work not found'));
      resolve(work);
    });
  });
};

const getWorkByBlockchainId = (blockchainWorkId) => {
  return new Promise((resolve, reject) => {
    workRepository.getWorkByBlockchainId(blockchainWorkId, (err, work) => {
      if (err) return reject(err);
      if (!work) return reject(new Error('Work not found'));
      resolve(work);
    });
  });
};

const getAllWorks = () => {
  return new Promise((resolve, reject) => {
    workRepository.getAllWorks((err, works) => {
      if (err) return reject(err);
      resolve(works);
    });
  });
};

// Obtener trabajos de un usuario específico (como cliente o trabajador)
const getWorksByUser = (userId) => {
  return new Promise((resolve, reject) => {
    workRepository.getWorksByUser(userId, (err, works) => {
      if (err) return reject(err);
      resolve(works);
    });
  });
};

const getWorksByClient = (clientId) => {
  return new Promise((resolve, reject) => {
    workRepository.getWorksByClient(clientId, (err, works) => {
      if (err) return reject(err);
      resolve(works);
    });
  });
};

const getWorksByWorker = (workerId) => {
  return new Promise((resolve, reject) => {
    workRepository.getWorksByWorker(workerId, (err, works) => {
      if (err) return reject(err);
      resolve(works);
    });
  });
};

const acceptWork = async (workId, workerId) => {
  try {
    // Obtener trabajo de la BD
    const work = await getWork(workId);
    
    if (work.statusId !== 0) { // 0 = Created
      throw new Error('Work is not in Created status');
    }

    if (work.workerId && work.workerId !== workerId) {
      throw new Error('Work is assigned to another worker');
    }

    console.log('🚀 Aceptando trabajo...');

    // Actualizar en BD
    return new Promise((resolve, reject) => {
      workRepository.updateWork(workId, {
        workerId: workerId,
        statusId: 1 // 1 = InProgress
      }, (err, updatedWork) => {
        if (err) return reject(err);
        resolve(updatedWork);
      });
    });

  } catch (error) {
    console.error('❌ Error en acceptWork service:', error);
    throw error;
  }
};

const submitWork = async (workId, deliveryData, workerId) => {
  try {
    // Obtener trabajo de la BD
    const work = await getWork(workId);
    
    if (work.statusId !== 1) { // 1 = InProgress
      throw new Error('Work is not in InProgress status');
    }

    if (work.workerId !== workerId) {
      throw new Error('Only assigned worker can submit work');
    }

    if (!deliveryData || deliveryData.trim() === '') {
      throw new Error('Delivery data is required');
    }

    console.log('🚀 Entregando trabajo...');

    // Actualizar en BD
    return new Promise((resolve, reject) => {
      workRepository.updateWork(workId, {
        statusId: 2, // 2 = Submitted
        deliveryData: deliveryData
      }, (err, updatedWork) => {
        if (err) return reject(err);
        resolve(updatedWork);
      });
    });

  } catch (error) {
    console.error('❌ Error en submitWork service:', error);
    throw error;
  }
};

const approveWork = async (workId, clientId) => {
  try {
    // Obtener trabajo de la BD
    const work = await getWork(workId);
    
    if (work.statusId !== 2) { // 2 = Submitted
      throw new Error('Work is not in Submitted status');
    }

    if (work.clientId !== clientId) {
      throw new Error('Only client can approve work');
    }

    console.log('🚀 Aprobando trabajo...');

    // Actualizar en BD
    return new Promise((resolve, reject) => {
      workRepository.updateWork(workId, {
        statusId: 3 // 3 = Completed
      }, (err, updatedWork) => {
        if (err) return reject(err);
        resolve(updatedWork);
      });
    });

  } catch (error) {
    console.error('❌ Error en approveWork service:', error);
    throw error;
  }
};

const cancelWork = async (workId, clientId) => {
  try {
    // Obtener trabajo de la BD
    const work = await getWork(workId);
    
    if (![0, 1].includes(work.statusId)) { // 0 = Created, 1 = InProgress
      throw new Error('Work cannot be cancelled in current status');
    }

    if (work.clientId !== clientId) {
      throw new Error('Only client can cancel work');
    }

    console.log('🚀 Cancelando trabajo...');

    // Actualizar en BD
    return new Promise((resolve, reject) => {
      workRepository.updateWork(workId, {
        statusId: 4 // 4 = Cancelled
      }, (err, updatedWork) => {
        if (err) return reject(err);
        resolve(updatedWork);
      });
    });

  } catch (error) {
    console.error('❌ Error en cancelWork service:', error);
    throw error;
  }
};

// Actualizar estado de trabajo
const updateWorkStatus = async (workId, statusId) => {
  try {
    return new Promise((resolve, reject) => {
      workRepository.updateWork(workId, { statusId }, (err, updatedWork) => {
        if (err) return reject(err);
        resolve(updatedWork);
      });
    });
  } catch (error) {
    console.error('❌ Error en updateWorkStatus service:', error);
    throw error;
  }
};

// Actualizar datos de entrega
const updateWorkDelivery = async (workId, deliveryData) => {
  try {
    return new Promise((resolve, reject) => {
      workRepository.updateWork(workId, { deliveryData }, (err, updatedWork) => {
        if (err) return reject(err);
        resolve(updatedWork);
      });
    });
  } catch (error) {
    console.error('❌ Error en updateWorkDelivery service:', error);
    throw error;
  }
};

// Obtener balance USDC
const getUSDCBalance = async (address) => {
  try {
    return await blockchainService.getUSDCBalance(address);
  } catch (error) {
    console.error('❌ Error en getUSDCBalance service:', error);
    throw error;
  }
};

// Aprobar gasto USDC
const approveUSDC = async (spender, amount) => {
  try {
    return await blockchainService.approveUSDC(spender, amount);
  } catch (error) {
    console.error('❌ Error en approveUSDC service:', error);
    throw error;
  }
};

// Verificar conexión con blockchain
const checkBlockchainConnection = async () => {
  try {
    return await blockchainService.checkConnection();
  } catch (error) {
    console.error('❌ Error en checkBlockchainConnection service:', error);
    throw error;
  }
};

module.exports = {
  createWork,
  getWork,
  getWorkByBlockchainId,
  getAllWorks,
  getWorksByUser,
  getWorksByClient,
  getWorksByWorker,
  acceptWork,
  submitWork,
  approveWork,
  cancelWork,
  updateWorkStatus,
  updateWorkDelivery,
  getUSDCBalance,
  approveUSDC,
  checkBlockchainConnection
};
