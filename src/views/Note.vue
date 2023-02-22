<template>
  <div class="page-container">
    <div class="note-editor">
      <textarea
        ref="content"
        class="note-content lined-paper"
        @input="onNoteContentChange"
        v-model="noteContent"
        style="background-color: transparent"
      ></textarea>
      <div class="float-panel">
        <button @click="saveNote">
          <font-awesome-icon icon="fas fa-save" />
        </button>
        <button @click="backHome">
          <font-awesome-icon icon="fas fa-home" />
        </button>
        <button @click="deleteNote">
          <font-awesome-icon icon="fas fa-trash-alt" />
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import noteManager from "../helper/note.manager";

export default {
  name: "Note",
  data() {
    return {
      noteId: this.$route.params.id,
      noteContent: "",
    };
  },
  mounted() {
    if (this.noteId) {
      this.updateNote();
      this.autoUpdateNote();
      this.autoSaveNote();
    }
  },
  created() {
    if (!this.$route.params.id) {
      document.title = "Notepad v.0.01 / Add New";
    }
  },
  methods: {
    backHome() {
      this.$router.push("/");
    },
    async updateNote() {
      const note = await noteManager.getNote(this.noteId);
      this.noteContent = note.content;
      this.sanitizeNoteContent();
      document.title = `Notepad v.0.01 / ${note.title}`;
    },
    // This method saves the note and updates the noteContent
    async saveNote() {
      this.sanitizeNoteContent();
      const title = this.noteContent.split("\n")[0].trim();
      const note = {
        title: title,
        content: this.noteContent,
        createdDate: new Date().toISOString(),
      };
      try {
        if (this.noteId) {
          const result = await noteManager.updateNote(
            this.noteId,
            note.content
          );
          console.log(`Note updated with ID: ${this.noteId}`);
        } else {
          const fileName = await noteManager.addNote(
            note.title,
            note.content,
            note.createdDate
          );
          console.log(`Note saved with filename: ${fileName}`);
          this.$router.push(`/note/${fileName}`);
        }
      } catch (error) {
        console.error(error);
      }
    },
    // This method removes the first beginning whitespace and newline
    sanitizeNoteContent() {
      this.noteContent = this.noteContent.replace(/^\s*\n/, "");
    },
    // This method sets an interval to update the note every 1 minute
    autoUpdateNote() {
      setInterval(() => {
        this.updateNote();
      }, 60000);
    },
    // This method sets an interval to save the note every 1 minute
    autoSaveNote() {
      setInterval(() => {
        if (this.noteId) {
          this.saveNote();
        }
      }, 60000);
    },
    async deleteNote() {
      try {
        const result = await noteManager.deleteNote(this.noteId);
        console.log(`Note deleted with ID: ${this.noteId}`);
        this.$router.push("/");
      } catch (error) {
        console.error(error);
      }
    },
    // Other methods...
  },
};
</script>

<style scoped>
.page-container {
  margin: 0 auto;
  padding: 0;
  width: 100%;
  background: #fffbe7;
}

.note-editor {
  width: 100%;
  height: 100vh;
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.note-content {
  width: 100%;
  height: 98vh;
  min-height: 98%;
  resize: none;
  border: none;
  font-size: 18px;
  line-height: 30px;
  box-sizing: border-box;
  padding: 30px;
  color: #000;
  outline: none;
  overflow-y: auto;
}

.float-panel {
  position: fixed;
  bottom: 10px;
  left: 0;
  right: 0;
  display: flex;
  justify-content: center;
  background-color: rgb(0 0 0 / 70%);
  padding: 5px;
  border-radius: 6px;
  width: 150px;
  margin-left: auto;
  margin-right: auto;
}

.float-panel button {
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: transparent;
  border: none;
  color: #ffffff;
  font-size: 16px;
  margin: 5px;
  padding: 5px;
  width: 30px;
  height: 30px;
}

.float-panel button:hover {
  color: #dbb800;
}

.float-panel button i {
  margin-right: 5px;
}
</style>
