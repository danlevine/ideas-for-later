import React from 'react';
import Firebase from 'firebase';

import Notes from './Notes.jsx';

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.notes = [];
    this.firebaseRef = new Firebase("https://flickering-fire-3051.firebaseio.com/notes");
    this.deleteNote = this.deleteNote.bind(this);
    this.editNote = this.editNote.bind(this);
  }

  componentWillMount() {
    this.firebaseRef.on("child_added", function(dataSnapshot) {
      var currentNote = dataSnapshot.val();
      currentNote.id = dataSnapshot.key();
      this.notes.push(currentNote);
      this.setState({
        notes: this.notes
      });
    }.bind(this));
    this.firebaseRef.on("child_removed", function(dataSnapshot) {
      this.notes = this.notes.filter(note => note.id != dataSnapshot.key());
      this.setState({
        notes: this.notes
      });
    }.bind(this));
    this.firebaseRef.on("child_changed", function(dataSnapshot) {
      for (let note of this.notes) {
        if (note.id === dataSnapshot.key()) {
          note.task = dataSnapshot.val().task;
          break;
        }
      }
      this.setState({
        notes: this.notes
      });
    }.bind(this));
  }

  render() {
    const notes = this.state ? this.state.notes : [];

    return (
      <div>
        <button className="add-note" onClick={this.addNote}>+</button>
        <Notes notes={notes} 
          onEdit={this.editNote}
          onDelete={this.deleteNote} />
      </div>
    );
  }

  addNote = (e) => {
    e.preventDefault();
    this.firebaseRef.push({
      task: 'New task'
    });
  };

  editNote = (id, task) => {
    // Don't modify if trying set an empty value
    if(!task.trim()) {
      return;
    }

    this.notes = this.notes.map(note => {
      if(note.id === id && task) {
        note.task = task;
      }

      return note;
    });
    this.firebaseRef.child(id).set({task: task});
    this.setState({
      notes: this.notes
    });
  };

  deleteNote = (id, e) => {
    // Avoid bubbling to edit
    e.stopPropagation();
    this.firebaseRef.child(id).remove();
  };
}