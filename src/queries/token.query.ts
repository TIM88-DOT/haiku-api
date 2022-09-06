export const QUERY = {
    SELECT_TOKENS: 'SELECT * FROM tokens ORDER BY created_at DESC LIMIT 50',
    SELECT_TOKEN: 'SELECT * FROM tokens WHERE id = ?',
    CREATE_TOKEN: 'INSERT INTO tokens (name, symbol, address, chain_id, vote_count) VALUES(?, ?, ?, ?, ?)',
    UPDATE_TOKEN: 'UPDATE tokens SET name = ?, symbol = ?, address = ?, chain_id = ?, vote_count = ? WHERE id = ?',
    DELETE_TOKEN: 'DELETE from tokens WHERE id = ?',
};