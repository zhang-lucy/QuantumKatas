import qsharp
from SimpleCardGame import PlayAndMeasure
from io import StringIO 
import sys

class Capturing(list):
    def __enter__(self):
        self._stdout = sys.stdout
        sys.stdout = self._stringio = StringIO()
        return self
    def __exit__(self, *args):
        self.extend(self._stringio.getvalue().splitlines())
        del self._stringio    # free up some memory
        sys.stdout = self._stdout

from flask import Flask, request, jsonify
app = Flask(__name__)

@app.route("/simulate", methods = ['POST'])
def simulate():
    data = request.get_json()
    
    with Capturing() as output:
        measurements = PlayAndMeasure.simulate(gates=data["cards"], pastGatesQ1=data["q1_hist"], pastGatesQ2=data["q2_hist"])
    
    states = ['(' + outputs[0].split('\t')[1] + ')|0> + (' + outputs[1].split('\t')[1] + ')|1>', \
              '(' + outputs[2].split('\t')[1] + ')|0> + (' + outputs[3].split('\t')[1] + ')|1>']
    
    q1_log = "You applied " + data["cards"] + " to Q1, which resulted in the state " + states[0] + " and a measurement of " + measurements[0]
    q2_log = "You applied " + data["cards"] + " to Q2, which resulted in the state " + states[1] + " and a measurement of " + measurements[1]
    
    res = {'status': 'ok', 'measurements': measurements, 'states': output, 'logs': [q1_log, q2_log]}
    return jsonify(res)

if __name__ == "__main__":
    app.run()