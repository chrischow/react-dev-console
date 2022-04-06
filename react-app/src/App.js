import React from 'react';
import './App.css';
import $ from 'jquery';


console.Log = console.log;

function CellOutput(props) {
  var outputs = '';
  // Overwrite console.log
  console.log = function() {
    var args = Array.prototype.slice.call(arguments);
    for (var i=0; i<args.length; i++) {
      if (typeof args[i] === 'string') {
        outputs = outputs + args[i]
      } else {
        outputs = outputs + JSON.stringify(args[i]);
      }

      if (i < args.length-1) {
        outputs = outputs + ' ';
      }
    }
    return outputs
  };

  if (props.cell) {
    try {
      var commandOutput = eval(props.cell);

      if (!commandOutput) {
        commandOutput = 'null';
      }

      if (typeof commandOutput === 'string') {
        return <div>{commandOutput}</div>;
      } else {
        var allText = JSON.stringify(commandOutput, null, 2);
        var allTextNodes = allText.split('\n').map(function(textNode) {
          return <pre>{textNode}</pre>;
        });
        return allTextNodes;
      }
    } catch(err){
      var errorLines = err.stack.split('\n');
      return <div className="error">{errorLines[0]}</div>;
    }
  }
  return <div>Unknown error.</div>;
}

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
            rows="3"
          >
          </textarea>
        </form>
        <div className="play-button-div" id={'cell-' + props.id + '-play'} onClick={runCell}>
          <svg className="play-button" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512" role="img">
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

function App() {
  return (
    <div className="container mt-4">
      <h1 className="text-center">React Dev Console</h1>
      <p className="subtitle text-center mb-4">
        A workaround console for debugging your code in a tool-less environment.
      </p>
      <Cell id="1" />
      {/* <div className="text-center mt-5 mb-5">
        <button className="btn btn-sm btn-blue">Add Cell</button>
      </div> */}
    </div>
  );
}

export default App;
