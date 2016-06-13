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
    this.firebaseRef.on("child_added", (dataSnapshot) => {
      var currentNote = dataSnapshot.val();
      currentNote.id = dataSnapshot.key();
      var oReq = new XMLHttpRequest();
      oReq.addEventListener("load", (data) => { 

        console.log(data.currentTarget.responseText);
        var responseObj = JSON.parse(data.currentTarget.responseText);
        currentNote.plot = responseObj.Plot;
        currentNote.posterUrl = responseObj.Poster;
        currentNote.ratingImdb = responseObj.imdbRating;

        console.log(this.notes);
        this.setState({
          notes: this.notes
        });
        
      });
      oReq.open("GET", "http://www.omdbapi.com/?t=" + currentNote.task + "&y=&plot=short&r=json", true);
      oReq.send();
      this.notes.push(currentNote);
      this.setState({
        notes: this.notes
      });
    });
    this.firebaseRef.on("child_removed", (dataSnapshot) => {
      this.notes = this.notes.filter(note => note.id != dataSnapshot.key());
      this.setState({
        notes: this.notes
      });
    });
    this.firebaseRef.on("child_changed", (dataSnapshot) => {
      for (let note of this.notes) {
        if (note.id === dataSnapshot.key()) {
          note.task = dataSnapshot.val().task;

          var oReq = new XMLHttpRequest();
          oReq.addEventListener("load", (data) => { 

            console.log(data.currentTarget.responseText);
            var responseObj = JSON.parse(data.currentTarget.responseText);
            note.plot = responseObj.Plot;
            note.posterUrl = responseObj.Poster;
            note.ratingImdb = responseObj.imdbRating;

            console.log(this.notes);
            this.setState({
              notes: this.notes
            });
            
          });
          oReq.open("GET", "http://www.omdbapi.com/?t=" + note.task + "&y=&plot=short&r=json", true);
          oReq.send();

          break;
        }
      }
      this.setState({
        notes: this.notes
      });
    });
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