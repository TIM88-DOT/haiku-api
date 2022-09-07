export const QUERY = {
    SELECT_TOKENS: 'SELECT * FROM tokens ORDER BY created_at DESC LIMIT 50',
    SELECT_TOKEN_BY_ADDRESS: 'SELECT * FROM tokens WHERE address = ?',
    CREATE_TOKEN: 'INSERT INTO tokens (name, symbol, address, chain_id, vote_count) VALUES(?, ?, ?, ?, ?)',
    UPDATE_TOKEN: 'UPDATE tokens SET name = ?, symbol = ?, address = ?, chain_id = ?, vote_count = ? WHERE address = ?',
    DELETE_TOKEN: 'DELETE from tokens WHERE address = ?',
};