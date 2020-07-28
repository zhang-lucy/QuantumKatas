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
    
    res = {'status': 'ok', 'measurements': measurements, 'states': output}
    return jsonify(res)

if __name__ == "__main__":
    app.run()