namespace SimpleCardGame {
    open Microsoft.Quantum.Intrinsic;

    operation PlayAndMeasure(state : Bool, gate : String) : Result {
        using (q = Qubit())  { // Allocate a qubit.
            
            if (state) {
                X(q);
            }
            
            if (gate == "X") {
                X(q);
            }
            elif (gate == "H") {
                H(q);
            }
            elif (gate == "Y") {
                Y(q);
            }
            elif (gate == "Z") {
                Z(q);
            }
            elif (gate == "I") {
                I(q);
            }
            
            let r = M(q);     // Measure the qubit value.
            Reset(q);
            return r;
        }
    }
}

// ['X', 'H', 'Y', 'Z', 'I']