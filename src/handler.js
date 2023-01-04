const { nanoid } = require('nanoid');
const books = require('./books');

const addBook = (req, h) => {
  const {
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
  } = req.payload;

  if (!name) {
    const res = h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. Mohon isi nama buku',
    });
    return res.code(400);
  }
  if (readPage > pageCount) {
    const res = h.response({
      status: 'fail',
      message:
        'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount',
    });
    return res.code(400);
  }

  const id = nanoid(16);
  const insertedAt = new Date().toISOString();
  const updatedAt = insertedAt;
  const finished = pageCount === readPage;

  const newBook = {
    id,
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    finished,
    reading,
    insertedAt,
    updatedAt,
  };
  books.push(newBook);

  const isSuccess = books.filter((book) => book.id === id).length > 0;
  if (isSuccess) {
    const res = h.response({
      status: 'success',
      message: 'Buku berhasil ditambahkan',
      data: {
        bookId: id,
      },
    });
    return res.code(201);
  }
  const res = h.response({
    status: 'error',
    message: 'Buku gagal ditambahkan',
  });
  return res.code(500);
};

const getAllBooks = (req, h) => {
  const { name, reading, finished } = req.query;

  let filterBook = books;
  if (name) {
    filterBook = books.filter((book) => book.name.toLowerCase().includes(name.toLowerCase()));
  }
  if (reading === '0') {
    filterBook = books.filter((book) => book.reading === false);
  } else if (reading === '1') {
    filterBook = books.filter((book) => book.reading === true);
  }
  if (finished === '0') {
    filterBook = books.filter((book) => book.finished === false);
  } else if (finished === '1') {
    filterBook = books.filter((book) => book.finished === true);
  }

  const res = h.response({
    status: 'success',
    data: {
      books: filterBook.map((book) => ({
        id: book.id,
        name: book.name,
        publisher: book.publisher,
      })),
    },
  });
  return res.code(200);
};

const getBookById = (req, h) => {
  const { bookId } = req.params;

  const getBook = books.find((book) => book.id === bookId);
  if (getBook) {
    const res = h.response({
      status: 'success',
      data: {
        book: getBook,
      },
    });
    return res.code(200);
  }
  const res = h.response({
    status: 'fail',
    message: 'Buku tidak ditemukan',
  });
  return res.code(404);
};

const editBookById = (req, h) => {
  const { bookId } = req.params;
  const {
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
  } = req.payload;

  if (!name) {
    const res = h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. Mohon isi nama buku',
    });
    return res.code(400);
  }
  if (readPage > pageCount) {
    const res = h.response({
      status: 'fail',
      message:
        'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount',
    });
    return res.code(400);
  }

  const indexBook = books.findIndex((book) => book.id === bookId);
  if (indexBook !== -1) {
    const updatedAt = new Date().toISOString();
    const finished = pageCount === readPage;
    books[indexBook] = {
      ...books[indexBook],
      name,
      year,
      author,
      summary,
      publisher,
      pageCount,
      readPage,
      reading,
      updatedAt,
      finished,
    };
    const res = h.response({
      status: 'success',
      message: 'Buku berhasil diperbarui',
    });
    return res.code(200);
  }
  const res = h.response({
    status: 'fail',
    message: 'Gagal memperbarui buku. Id tidak ditemukan',
  });
  return res.code(404);
};

const deleteBookById = (req, h) => {
  const { bookId } = req.params;

  const indexBook = books.findIndex((book) => book.id === bookId);
  if (indexBook !== -1) {
    books.splice(indexBook, 1);
    return h.response({
      status: 'success',
      message: 'Buku berhasil dihapus',
    }).code(200);
  }

  return h.response({
    status: 'fail',
    message: 'Buku gagal dihapus. Id tidak ditemukan',
  }).code(404);
};

module.exports = {
  addBook,
  getAllBooks,
  getBookById,
  editBookById,
  deleteBookById,
};
