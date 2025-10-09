// states.js - Estados alineados con el smart contract WorkEscrow.sol
const STATES = {
    CREATED: "Created",
    IN_PROGRESS: "InProgress", 
    SUBMITTED: "Submitted",
    COMPLETED: "Completed",
    CANCELLED: "Cancelled"
};

const TRANSITIONS = {
    Created: ["InProgress", "Cancelled"],
    InProgress: ["Submitted", "Cancelled"],
    Submitted: ["Completed", "Cancelled"],
    Completed: [],
    Cancelled: []
};

class StatusMachine {
    constructor(initialState = STATES.CREATED) {
        this.state = initialState;
    }

    canTransitionTo(nextState) {
        const allowed = TRANSITIONS[this.state] || [];
        return allowed.includes(nextState);
    }

    transitionTo(nextState) {
        if (this.canTransitionTo(nextState)) {
            this.state = nextState;
            return true;
        } else {
            throw new Error(`Transición inválida de ${this.state} a ${nextState}`);
        }
    }

    getState() {
        return this.state;
    }
}

module.exports = { STATES, StatusMachine };
