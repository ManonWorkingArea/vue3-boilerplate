const API_BASE_URL =
  "https://faas-sgp1-18bc02ac.doserverless.co/api/v1/web/fn-18049d16-6770-4e64-8a95-4a6d98f69eb4/default";
const BASIC_AUTH_TOKEN =
  "YzdiNDM5NGQtNTgyMy00ZmU0LWFlYmUtYjhjOTg3NDA1NjkyOll4VUg2UmJWTE5KQkJzWGZ2WVN1MFNyaEUzQ2NFczk5VEVoWUZCZ3NkTWoxc0NPWmZmMVloRDBQelVKMHNIMWQ=";

export default {
  async getNotes() {
    try {
      const response = await fetch(
        `${API_BASE_URL}/all?collection=notes&page=1&perPage=20&sorting=createdAt|desc`,
        {
          headers: {
            Authorization: `Basic ${BASIC_AUTH_TOKEN}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      return {
        data: result.result.data,
        pagination: {
          currentPage: result.result.pagination.currentPage,
          hasNext: result.result.pagination.hasNext,
          hasPrev: result.result.pagination.hasPrev,
          totalItems: result.result.pagination.totalItems,
          totalPages: result.result.pagination.totalPages,
        },
        status: result.result.status,
      };
    } catch (err) {
      console.error(err);
      return {
        data: [],
        pagination: {},
        status: 500,
      };
    }
  },
  async getNote(noteId) {
    try {
      const response = await fetch(
        `${API_BASE_URL}/read/?query={"id":"${noteId}","sorting":"firstname|asc"}&collection=notes&level=0`,
        {
          headers: {
            Authorization: `Basic ${BASIC_AUTH_TOKEN}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      return {
        id: result.result._id,
        title: result.result.title,
        content: result.result.content,
        createdAt: new Date(result.result.createdAt),
      };
    } catch (err) {
      console.error(err);
      return null;
    }
  },
  async updateNote(noteId, newContent) {
    try {
      const response = await fetch(`${API_BASE_URL}/update`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Basic ${BASIC_AUTH_TOKEN}`,
        },
        body: JSON.stringify({
          data: {
            content: newContent,
          },
          collection: "notes",
          id: noteId,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      return result;
    } catch (err) {
      console.error(err);
      return null;
    }
  },
  async addNote(title, content, createdDate) {
    const data = {
      title: title,
      content: content,
      createdAt: createdDate,
    };

    const response = await fetch(`${API_BASE_URL}/create`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Basic ${BASIC_AUTH_TOKEN}`,
      },
      body: JSON.stringify({
        data: data,
        collection: "notes",
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();

    return result.result._id;
  },
  async deleteNote(noteId) {
    try {
      const response = await fetch(
        `${API_BASE_URL}/delete/?id=${noteId}&collection=notes`,
        {
          method: "GET",
          headers: {
            Authorization: `Basic ${BASIC_AUTH_TOKEN}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      return result;
    } catch (err) {
      console.error(err);
      return null;
    }
  },
  async searchNotes(keyword) {
    try {
      const response = await fetch(
        `${API_BASE_URL}/all?collection=notes&page=1&perPage=100&sorting=title|asc`,
        {
          headers: {
            Authorization: `Basic ${BASIC_AUTH_TOKEN}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      const notes = result.result.data.filter((note) => {
        const titleMatch = note.title
          .toLowerCase()
          .includes(keyword.toLowerCase());
        const contentMatch = note.content
          .toLowerCase()
          .includes(keyword.toLowerCase());
        return titleMatch || contentMatch;
      });

      return {
        data: notes,
        pagination: {
          currentPage: result.result.pagination.currentPage,
          hasNext: result.result.pagination.hasNext,
          hasPrev: result.result.pagination.hasPrev,
          totalItems: result.result.pagination.totalItems,
          totalPages: result.result.pagination.totalPages,
        },
        status: result.result.status,
      };
    } catch (err) {
      console.error(err);
      return {
        data: [],
        pagination: {},
        status: 500,
      };
    }
  },
};
