const express = require('express');
const cors = require('cors');
const { sql, poolPromise } = require('./db.cjs');

const app = express();
app.use(cors());
app.use(express.json());

app.use((req, res, next) => {
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    next();
});

app.get('/data', async (req, res) => {
    try {
        const pool = await poolPromise;
        const query = `
        select top 1000 m.ps_no, m.ps_dd, c.cus_no, c.name collate Chinese_PRC_CI_AS cus_name, m.dep, m.sal_no, t.wh, p.prd_no, t.qty, up, isnull(p.upr, 0) upr, amtn_net, p.name collate Chinese_PRC_CI_AS prd_name
        from MF_PSS m
        inner join TF_PSS t on t.ps_no = m.ps_no
        inner join PRDT p on p.prd_no = t.prd_no
        inner join CUST c on c.cus_no = m.cus_no
        where bil_type = '02' and substring(p.prd_no, 8 , 1) = '3' and p.idx1 = 'P'
        ORDER BY m.ps_dd DESC
        `;
        const result = await pool.request().query(query);
        res.json(result.recordset);
    } catch (err) {
        console.error('SQL error: ', err);
        res.status(500).send('Something went wrong');
    }

});
// app.get('/data/:cus_no', async (req, res) => {
//     const cusNo = req.params.cus_no;
//     try {
//         const pool = await poolPromise;
//         const query = `
//         select top 2000 m.ps_no, m.ps_dd, c.cus_no, c.name collate Chinese_PRC_CI_AS cus_name, m.dep, m.sal_no, t.wh, p.prd_no, t.qty, up, isnull(p.upr, 0) upr, amtn_net, p.name collate Chinese_PRC_CI_AS prd_name
//         from MF_PSS m
//         inner join TF_PSS t on t.ps_no = m.ps_no
//         inner join PRDT p on p.prd_no = t.prd_no
//         inner join CUST c on c.cus_no = m.cus_no
//         where bil_type = '02' and substring(p.prd_no, 8 , 1) = '3' and p.idx1 = 'P' and c.cus_no = @cusNo
//         `;
//         const result = await pool.request()
//             .input('cusNo', cusNo)
//             .query(query);
//         res.json(result.recordset);
//     } catch (err) {
//         console.error('SQL error: ', err);
//         res.status(500).send('Something went wrong');
//     }
// });

app.get('/data/:cus_no', async (req, res) => {
    const cusNo = req.params.cus_no;
    const option = req.query.option;
    try {
        const pool = await poolPromise;
        let query;
        if (option === '0') {
            query = `
            select top 2000 m.ps_no, m.ps_dd, c.cus_no, c.name collate Chinese_PRC_CI_AS cus_name, m.dep, m.sal_no, t.wh, p.prd_no, t.qty, up, isnull(p.upr, 0) upr, amtn_net, p.name collate Chinese_PRC_CI_AS prd_name
            from MF_PSS m
            inner join TF_PSS t on t.ps_no = m.ps_no
            inner join PRDT p on p.prd_no = t.prd_no
            inner join CUST c on c.cus_no = m.cus_no
            where bil_type = '02' and substring(p.prd_no, 8 , 1) = '3' and p.idx1 = 'P' and c.cus_no = @cusNo
            `;
        } else {
            query = `
            select top 2000 m.ps_no, m.ps_dd, c.cus_no, c.name collate Chinese_PRC_CI_AS cus_name, m.dep, m.sal_no, t.wh, p.prd_no, t.qty, up, isnull(p.upr, 0) upr, amtn_net, p.name collate Chinese_PRC_CI_AS prd_name
            from MF_PSS m
            inner join TF_PSS t on t.ps_no = m.ps_no
            inner join PRDT p on p.prd_no = t.prd_no
            inner join CUST c on c.cus_no = m.cus_no
            where bil_type = '02' and substring(p.prd_no, 8 , 1) = '3' and p.idx1 = 'P' and c.cus_no = @cusNo and upr ${option} up
            `;
        }
        const result = await pool.request()
            .input('cusNo', cusNo)
            .query(query);
        console.log(result.recordset);
        res.json(result.recordset);
    } catch (err) {
        console.error('SQL error: ', err);
        res.status(500).send('Something went wrong');
    }
});

const port = process.env.PORT || 3001;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
