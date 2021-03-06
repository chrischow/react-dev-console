import React from 'react';
import './App.css';
import $ from 'jquery';

// Save original console.log for debugging
console.Log = console.log;

// Cell output component: appears below code cell
function CellOutput(props) {
  
  // Overwrite console.log
  console.log = function() {
    var logOutputs = '';
    var args = Array.prototype.slice.call(arguments);
    
    for (var idx=0; idx<args.length; idx++) {
      if (typeof args[idx] === 'string') {
        logOutputs = logOutputs + args[idx]
      } else {
        logOutputs = logOutputs + JSON.stringify(args[idx]);
      }

      if (idx < args.length-1) {
        logOutputs = logOutputs + ' ';
      }
    }
    outputs.push(<pre>{logOutputs}</pre>);
  };

  var outputs = [];

  if (props.cell) {
    try {
      var commandOutput = eval(props.cell);

      if (!commandOutput) {
        return outputs;
      }

      if (typeof commandOutput === 'string' || typeof commandOutput === 'number') {
        outputs.push(<pre className="return-text">{commandOutput}</pre>);
      } else {
        var allText = JSON.stringify(commandOutput, null, 2);
        var allTextNodes = allText.split('\n').map(function(textNode) {
          return <pre className="return-text">{textNode}</pre>;
        });
        outputs = outputs.concat(allTextNodes);
      }
    } catch(err){
      var errorLines = err.stack.split('\n');
      outputs.push(<pre className="error">{errorLines[0]}</pre>);
    }
  }

  // Clean up
  outputs = outputs.filter(function(output) {
    return output !== null
  });
  
  return outputs
}

// Cell component: code + output
function Cell(props) {
  // Initialise states: `form` for controlled form and `cell` for cell value
  const [cell, setCell] = React.useState('');
  const [form, setForm] = React.useState({
    commands: ''
  });

  function handleChange(event) {
    setForm(prevForm => {
      return {
        ...prevForm,
        [event.target.name]: event.target.value
      };
    });
  }

  function runCell() {
    setCell(form.commands)
  }

  // Set up listener - run after every render
  React.useEffect(function() {
    $('#cell-' + props.id).keydown(function(e) {
      // Tab
      if (e.keyCode === 9) {
        e.preventDefault();
        // var start = this.selectionStart;
        // var end = this.selectionEnd;

        // // set textarea value to: text before caret + tab + text after caret
        // this.value = this.value.substring(0, start) + "  " + this.value.substring(end);

        // // put caret at right position again
        // this.selectionStart = this.selectionEnd = start + 1;
      }

      // Ctrl + Enter: Run
      if (e.ctrlKey && (e.keyCode === 13)) {
        $('#cell-' + props.id + '-play').click();
      }
    });

    $('#cell-' + props.id).on('input', function () {
      this.style.height = "";
      this.style.height = this.scrollHeight + "px";
    });
  });

  return (
    <div>
      <div className="cell-div mb-3">
        <form className="form">
          <textarea
            id={'cell-' + props.id}
            className="form-control"
            name="commands"
            value={form.commands}
            onChange={handleChange}
            placeholder="Input your code here"
            rows="3"
          >
          </textarea>
        </form>
        <div 
          className="play-button-div"
          id={'cell-' + props.id + '-play'}
          onClick={runCell}
        >
          <svg 
            className="play-button"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 384 512"
            role="img"
          >
            <path 
              fill="currentcolor"
              d="M361 215C375.3 223.8 384 239.3 384 256C384 272.7 375.3 288.2 361 
              296.1L73.03 472.1C58.21 482 39.66 482.4 24.52 473.9C9.377 465.4 0 
              449.4 0 432V80C0 62.64 9.377 46.63 24.52 38.13C39.66 29.64 58.21 
              29.99 73.03 39.04L361 215z"
            />
          </svg>
        </div>
      </div>
        {cell && <div className="msg">
          <CellOutput cell={cell} />
        </div>}
    </div>
  );
}

// Main app component
function App() {
  return (
    <div className="container mt-4">
      <h1 className="text-center">React Dev Console</h1>
      <p className="subtitle text-center mb-4 align-items-center">
        <span className="mr-2">
          A tool for testing your code in a limiting IT environment.
        </span>
        <a data-toggle="modal" data-target="#infoModal">
          <svg 
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 512 512"
            role="img"
            className="play-button mb-1"
          >
            <path 
              fill="currentColor"
              d="M256 0C114.6 0 0 114.6 0 256s114.6 256 256 256s256-114.6 
              256-256S397.4 0 256 0zM256 400c-18 0-32-14-32-32s13.1-32 32-32c17.1 
              0 32 14 32 32S273.1 400 256 400zM325.1 258L280 286V288c0 13-11 24-24 
              24S232 301 232 288V272c0-8 4-16 12-21l57-34C308 213 312 206 312 
              198C312 186 301.1 176 289.1 176h-51.1C225.1 176 216 186 216 198c0 
              13-11 24-24 24s-24-11-24-24C168 159 199 128 237.1 128h51.1C329 128 
              360 159 360 198C360 222 347 245 325.1 258z"
            />
          </svg>
        </a>
      </p>
      <Cell id="1" />
      <div 
        className="modal fade"
        id="infoModal"
        tabIndex="-1"
        role="dialog"
        aria-labelledby="infoModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog" role="document">
          <div className="modal-content bg-dark">
            <div className="modal-header">
              <h5 className="modal-title" id="infoModalLabel">About This Project</h5>
              <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div className="modal-body">
              <p>
                <span className="text-green">React Dev Console </span>  
                is a tool built in React.js to enable testing of JS code in the browser.
              </p>
              <p>
                Simply paste your code into the code cell and hit 
                <span className="text-blue"> Ctrl + Enter</span> or click the
                play button 
                <svg 
                  className="ml-1 play-button mr-1"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 384 512"
                  role="img"
                >
                  <path 
                    fill="currentcolor"
                    d="M361 215C375.3 223.8 384 239.3 384 256C384 272.7 375.3 288.2 361 
                    296.1L73.03 472.1C58.21 482 39.66 482.4 24.52 473.9C9.377 465.4 0 
                    449.4 0 432V80C0 62.64 9.377 46.63 24.52 38.13C39.66 29.64 58.21 
                    29.99 73.03 39.04L361 215z"
                  />
                </svg>
                to run your code.
              </p>
              <p>Note the following:</p>
              <ul>
                <li>
                  <strong>The code cell is executed in its own local context. </strong> 
                  It has no access to variables or functions created in prior code runs.
                </li>
                <li>
                  <strong>The supported version of JavaScript depends entirely on the browser. </strong>
                  That means you can only use ES5 / ECMAScript 2009 for IE11, or ES6 / ECMAScript 2015 for
                  almost all versions of Chrome and Edge.
                </li>
                <li>The only additional third-party library available is jQuery 3.2.1.</li>
              </ul>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
