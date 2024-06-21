import type { NextApiRequest, NextApiResponse } from 'next';
import { Client } from '@clerk/clerk-sdk-node';
import getClerkClient from '@/utils/clerk/clerk';
import { metadata } from '../layout';


const handler = async (req: NextApiRequest, res: NextApiResponse) => {
const clerk = await getClerkClient();

    if (req.method !== 'POST') {
        return res.status(405).end(); // Method Not Allowed
    }

    const { userId, role } = req.body;

    try {
        
        // Обновляем роль пользователя в метаданных
        const updatedUser = await clerk.users.updateUser(userId, { publicMetadata: { role } });


        res.status(200).json({ message: 'Role assigned successfully' });
    } catch (error) {
        console.error('Error assigning role:', error);
        res.status(500).json({ error: 'Error assigning role' });
    }
};

export default handler;
