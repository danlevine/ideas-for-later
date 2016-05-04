import React from 'react';
import Firebase from 'firebase';

import { Link } from 'react-router'

export default class NewItem extends React.Component {
  constructor(props) {
    super(props);
    this.firebaseRef = new Firebase("https://flickering-fire-3051.firebaseio.com/notes");
    this.notes = [];
    this.state = {
      itemValue: ''
    };
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
  }

  render() {
    const notes = this.state ? this.state.notes : [];

    return (
      <div className="new-item">
        <form onSubmit={this.handleSubmit}>
          <h1>Suggest me something, you.</h1>
          <input type="text"
            value={this.state.itemValue}
            onChange={this.checkNote}/>
          <button className="add-note">Suggest</button>
        </form>
        <Link to="/list">Show me old ideas</Link>
      </div>
    );
  }

  handleSubmit = (e) => {
    e.preventDefault();
    const value = this.state.itemValue;

    if(value) {
      this.firebaseRef.push({
        task: value
      });
      this.setState({
        itemValue: ''
      });
      this.context.router.push('/list');
    }
    else {
      alert('enter a value');
    }
  };
  checkEnter = (e) => {
    // The user hit *enter*, let's finish up.
     if(e.key === 'Enter') {
       this.handleSubmit(e);
     }
  };
  checkNote = (e) => {
    this.setState({
      itemValue: e.target.value
    });
  };
  
}

NewItem.contextTypes = {
  router: React.PropTypes.object.isRequired
};
