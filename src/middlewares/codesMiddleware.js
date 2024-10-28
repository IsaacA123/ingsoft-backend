const db = require('../config/db'); 

const VerificationCode ={
    ceateCode: async (email, code, expiration) => {
        try {
            const [result] =await db.execute(
                'INSERT INTO verification_codes (email, verification_code, expiration) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE verification_code = ?, expiration = ?',
                [email, code, expiration, code, expiration]
            );
            return result;
        } catch (error) {
            console.error("Error:", error);
            throw error;
        }
    },
    verifyCode: async (email, code) => {
        try {
            const [rows] = await db.execute('SELECT verification_code, expiration FROM verification_codes WHERE email = ?', [email]);
    
            if (rows.length === 0) {
                return false;
            }
        
            for (const row of rows) {
                const { verification_code, expiration } = row;
                if (code === verification_code && new Date() <= new Date(expiration)) {
                    return true;
                }
            }
            return false;
        } catch (error) {
            console.error("Error:", error);
            throw error;
        }
    },
    deleteCodes: async (email) =>{
        try {
            const result = await db.execute('DELETE FROM verification_codes WHERE email = ?', [email]);
            return result;
        } catch (error) {
            console.error("Error:", error);
            throw error;
        }
    }

}



module.exports = VerificationCode;