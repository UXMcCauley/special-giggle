import { getFreshQBClient } from "../../../lib/quickbooks/getFreshQBClient";

export default async function handler(req: { user: { id: any; }; query: { quarter: string; year: number; }; }, res: { status: (arg0: number) => { (): any; new(): any; json: { (arg0: { error: any; }): void; new(): any; }; }; json: (arg0: any) => void; }) {
    try {
        const qbo = await getFreshQBClient(req.user.id);
        const quarter = req.query.quarter || 'Q1'; // Q1, Q2, Q3, Q4
        const year = req.query.year || new Date().getFullYear();

        const dateMap = {
            Q1: ['01-01', '03-31'],
            Q2: ['04-01', '06-30'],
            Q3: ['07-01', '09-30'],
            Q4: ['10-01', '12-31'],
        };

        const [start, end] = dateMap[quarter];
        const start_date = `${year}-${start}`;
        const end_date = `${year}-${end}`;

        qbo.reportProfitAndLoss({ start_date, end_date }, (err, report) => {
            if (err) return res.status(500).json({ error: err });
            res.json(report);
        });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
}