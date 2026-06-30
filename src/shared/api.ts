/**
 * Response payloads shared between the web client and the server.
 *
 * Each response carries a `type` discriminator so the client can narrow the
 * shape it received from a single `fetch` call.
 */

export type InitResponse = {
  type: 'init';
  postId: string;
  count: number;
  username: string;
};

export type IncrementResponse = {
  type: 'increment';
  postId: string;
  count: number;
};

export type DecrementResponse = {
  type: 'decrement';
  postId: string;
  count: number;
};

export type ErrorResponse = {
  status: 'error';
  message: string;
};
