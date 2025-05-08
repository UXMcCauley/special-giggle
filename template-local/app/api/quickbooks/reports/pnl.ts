import { getFreshQBClient } from '../../../lib/quickbooks/getFreshQBClient';

export default async function handler(req: { user: { id: string; }; query: { start_date: string; end_date: string; }; }, res: { status: (arg0: number) => { (): any; new(): any; json: { (arg0: { error: any; }): void; new(): any; }; }; json: (arg0: any) => void; }) {
    try {
        const qbo = await getFreshQBClient(req.user.id);
        const start = req.query.start_date || '2024-01-01';
        const end = req.query.end_date || '2024-12-31';

        qbo.reportProfitAndLoss({ start_date: start, end_date: end }, (err: any, report: any) => {
            if (err) return res.status(500).json({ error: err });
            res.json(report);
        });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
}