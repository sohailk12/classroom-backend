import express from 'express';
import { departments, subjects } from '../db/schema/app.js';
import { eq, ilike, or } from 'drizzle-orm/sql/expressions/conditions';
import { getTableColumns, sql ,desc} from 'drizzle-orm';
import { db } from '../db/index.js';

const router = express.Router();

router.get('/', async (req, res) => {
    try {
        // Simulate fetching subjects from a database
        const { search, department, page = '1', limit = '10' } = req.query;
        const parsedPage = Number.parseInt(String(page), 10);
        const parsedLimit = Number.parseInt(String(limit), 10);

        const currentPage = Number.isFinite(parsedPage) && parsedPage > 0 ? parsedPage : 1;
        const limitPerPage = Number.isFinite(parsedLimit) && parsedLimit > 0
                ? Math.min(parsedLimit, 100)
                : 10;
        const offset=(currentPage-1)*limitPerPage;

        const filterConditions=[];

        if(search){
            filterConditions.push(
                or(
                    ilike(subjects.name,`%${search}%`),
                    ilike(subjects.code,`%${search}%`)
                )
            );
        }
        if(department){
            filterConditions.push(
                ilike(departments.name,`%${department}%`)
            );
        }

        const whereClause=filterConditions.length>0?or(...filterConditions):undefined;

        const countResult = await db
        .select({count: sql<number>`count(*)`})
        .from(subjects)
        .leftJoin(departments,eq(subjects.departmentId,departments.id))
        .where(whereClause);

        const totalCount=countResult[0]?.count || 0;

        const subjectsList = await db
        .select({...getTableColumns(subjects),
            department:{...getTableColumns(departments)}}
        ).from(subjects)
        .leftJoin(departments,eq(subjects.departmentId,departments.id))
        .where(whereClause)
        .orderBy(desc(subjects.createdAt))
        .limit(limitPerPage)
        .offset(offset);
        
        // Placeholder response
        res.json({
            message: 'Subjects fetched successfully',
            data: subjectsList,
            pagination:{
                total: totalCount,
                limit: limitPerPage,
                page: currentPage,
                totalPages: Math.ceil(totalCount/limitPerPage)
            }
        });
    } catch (error) {
        console.error('Error fetching subjects:', error);
        res.status(500).json({ error: 'Failed to fetch subjects' });
    }
});

export default router;