import uuid from 'node-uuid';
import alt from '../libs/alt';
import NoteActions from '../actions/NoteActions';

class NoteStore {
  contructor() {
    this.bindActions(NoteActions);

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
  create(note) {

    const notes = this.notes;

    note.id = uuid.v4();

    this.setState({
      notes: notes.concat(note)
    });
  }
  update(updatedNote) {

    const notes = this.notes.map(note => {
      if (note.id === updatedNote.id) {
        return Object.assign({}, note, updatedNote);
      }

      return note;
    });

    this.setState({notes});
  }
  delete(id) {
    this.setState({
      notes: this.notes.filter(note => note.id !== id)
    });
  }
}

export default alt.createStore(NoteStore, 'NoteStore');