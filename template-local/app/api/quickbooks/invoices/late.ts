import { getFreshQBClient } from '../../../lib/quickbooks/getFreshQBClient';

export default async function handler(req: { user: { id: any; }; }, res: { status: (arg0: number) => { (): any; new(): any; json: { (arg0: { error: any; }): void; new(): any; }; }; json: (arg0: any) => void; }) {
    try {
        const qbo = await getFreshQBClient(req.user.id);

        qbo.findInvoices({ DocStatus: 'Open', DueDate: '<Today' }, (err: any, data: { QueryResponse: { Invoice: any; }; }) => {
            if (err) return res.status(500).json({ error: err });
            res.json(data.QueryResponse.Invoice || []);
        });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
}