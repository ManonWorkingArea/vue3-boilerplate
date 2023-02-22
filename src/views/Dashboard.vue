<template>
  <div class="page-container lined-paper">
    <header>
      <div class="header-container">
        <div class="search-container">
          <input
            type="text"
            placeholder="Search notes..."
            class="search-input"
            v-model="searchQuery"
          />
        </div>
        <div class="button-container">
          <router-link to="/note" class="new-note-button">New Note</router-link>
        </div>
      </div>
    </header>
    <div v-if="filteredNotes && filteredNotes.length" class="grid-container">
      <div
        v-for="(note, index) in filteredNotes"
        :key="index"
        class="grid-item"
        :class="{ folder: note.isFolder, file: !note.isFolder }"
      >
        <router-link :to="{ name: 'note', params: { id: note.id } }">
          <h2 class="note-title">{{ note.title }}</h2>
        </router-link>
        <div class="note-actions">
          <button class="delete-button" @click="deleteNote(index)">
            <font-awesome-icon icon="fas fa-trash-alt" />
          </button>
        </div>
        <p class="note-content">
          {{ truncateText(stripHtml(note.content), 100) }}
        </p>
        <div class="note-footer">
          <p class="note-date">Created on {{ formatDate(note.date) }}</p>
        </div>
      </div>
    </div>
    <div v-else class="no-notes-message">Nothing to show.</div>
  </div>
</template>

<script>
import noteManager from "../helper/note.manager";

export default {
  data() {
    return {
      notes: [],
      searchQuery: "",
    };
  },
  created() {
    document.title = "Notepad v.0.01";
  },
  async mounted() {
    try {
      const response = await noteManager.getNotes();
      if (response.status === 200) {
        const { data, pagination } = response;
        const notes = data.map((note) => {
          const { title, content, createdAt } = note;
          return { id: note._id, title, content, date: createdAt };
        });
        this.notes = notes;
      } else {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    } catch (error) {
      console.error(error);
    }
  },

  computed: {
    filteredNotes() {
      if (this.searchQuery.trim() === "") {
        return this.notes;
      } else {
        const lowerCaseSearchQuery = this.searchQuery.toLowerCase();
        return this.notes.filter((note) => {
          return (
            note.title.toLowerCase().includes(lowerCaseSearchQuery) ||
            note.content.toLowerCase().includes(lowerCaseSearchQuery)
          );
        });
      }
    },
  },

  methods: {
    async deleteNote(index) {
      const note = this.notes[index];
      if (
        confirm(`Are you sure you want to delete the note "${note.title}"?`)
      ) {
        try {
          const response = await noteManager.deleteNote(note.id);
          if (response.result.acknowledged) {
            this.notes.splice(index, 1);
          } else {
            throw new Error(
              `HTTP error! status: ${response.result.acknowledged}`
            );
          }
        } catch (error) {
          console.error(error);
        }
      }
    },
    formatDate: function (dateStr) {
      const date = new Date(dateStr);
      const options = { year: "numeric", month: "long", day: "numeric" };
      return date.toLocaleDateString(undefined, options);
    },
    truncateText: function (text, maxLength) {
      if (text.length > maxLength) {
        return text.substr(0, maxLength - 1) + "...";
      }
      return text;
    },
    stripHtml: function (html) {
      let tmp = document.createElement("DIV");
      tmp.innerHTML = html;
      return tmp.textContent || tmp.innerText || "";
    },
  },
};
</script>

<style scoped>
.page-container {
  margin: 0 auto;
  padding: 2rem;
  width: 100%;
  height: 100vh;
  overflow: hidden;
}

header {
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: transparent;
  box-shadow: none;
  padding: 10px 10px 30px 10px;
}

@media (max-width: 767px) {
  header {
    width: 100%;
    padding: 0;
  }
  .header-container {
    margin-bottom: 25px;
  }
  .search-container {
    padding: 0;
    margin: 0px 10px 0px 0px !important;
  }
}

.header-container {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  max-width: 600px;
}

.search-container {
  flex: 1;
  margin: 0 1rem;
}

.search-input {
  width: 100%;
  padding: 0.5rem 1rem;
  border-radius: 0.3rem;
  border: 1px solid #ccc;
  font-size: 18px;
  color: #000;
}

.new-note-button {
  background-color: #744141;
  color: #fff;
  border: none;
  border-radius: 0.3rem;
  padding: 13px;
  font-size: 1rem;
  cursor: pointer;
  line-height: 42px;
}

.grid-container {
  display: grid;
  grid-template-columns: repeat(1, 1fr);
  grid-gap: 1rem;
}

@media (min-width: 768px) {
  /* Display 4 columns on tablet */
  .grid-container {
    grid-template-columns: repeat(4, 1fr);
  }
}

@media (min-width: 1024px) {
  /* Display 6 columns on desktop */
  .grid-container {
    grid-template-columns: repeat(6, 1fr);
  }
}

.grid-item {
  background-color: #fff;
  border-radius: 0.5rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  padding: 1rem;
  color: #000;
  width: 100%;
  box-sizing: border-box;
}

.note-title {
  font-size: 1.5rem;
  font-weight: bold;
  margin-bottom: 0.5rem;
}

.note-content {
  margin-bottom: 1rem;
  max-height: 80px;
  overflow: hidden;
}

.note-actions {
  position: absolute;
  top: 5px;
  right: 10px;
}

.delete-button {
  background-color: transparent;
  border: none;
  cursor: pointer;
  font-size: 1.2rem;
  color: #666;
}

.delete-button:hover {
  color: #f00;
}

.folder {
  background-color: #ffd018;
}

.file {
  background-color: #fff;
}
</style>
