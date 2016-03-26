import uuid from 'node-uuid';
import React from 'react';

export default class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      notes: [
        {
          id: uuid.v4(),
          task: 'Poo!'
        },
        {
          id: uuid.v4(),
          task: 'Nap!'
        },
        {
          id: uuid.v4(),
          task: 'Bark!'
        },
        {
          id: uuid.v4(),
          task: 'Sniff!'
        },
        {
          id: uuid.v4(),
          task: 'Play!'
        }
      ]
    }
  }

  render() {

    const notes = this.state.notes;
    

    return (
      <div>
        <ul>{notes.map(note =>
          <li key={note.id}>{note.task}</li>
        )}</ul>
      </div>
    );

  }
}