import { APIRequestContext, APIResponse, expect } from '@playwright/test';
import type { Book, BooksResponse } from '../models/book.js';

export class BookStoreClient {
  public constructor(private readonly request: APIRequestContext) {}

  public async getBooks(): Promise<Book[]> {
    const response = await this.request.get('/BookStore/v1/Books');
    await expect(response).toBeOK();
    const payload = (await response.json()) as BooksResponse;
    return payload.books;
  }

  public async getBook(isbn: string): Promise<APIResponse> {
    return this.request.get('/BookStore/v1/Book', { params: { ISBN: isbn } });
  }

  public async addBooks(userId: string, token: string, isbns: string[]): Promise<APIResponse> {
    return this.request.post('/BookStore/v1/Books', {
      headers: { Authorization: `Bearer ${token}` },
      data: { userId, collectionOfIsbns: isbns.map((isbn) => ({ isbn })) },
    });
  }

  public async deleteAllBooks(userId: string, token: string): Promise<APIResponse> {
    return this.request.delete('/BookStore/v1/Books', {
      headers: { Authorization: `Bearer ${token}` },
      params: { UserId: userId },
    });
  }
}
