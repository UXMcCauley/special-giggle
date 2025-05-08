import { getFreshQBClient } from "../../lib/quickbooks/getFreshQBClient"

export default async function handler(req, res) {
    try {
        const qbo = await getFreshQBClient(req.user.id);
        qbo.findAccounts({}, (err, accounts) => {
            if (err) return res.status(500).json({ error: err });
            res.json(accounts);
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}