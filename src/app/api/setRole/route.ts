import { NextRequest, NextResponse } from 'next/server';
import getClerkClient from '@/utils/clerk/clerk';

export async function POST(req: NextRequest) {
    const clerk = await getClerkClient();

    try {
        const { userId, role } = await req.json();

        await clerk.users.updateUser(userId, { publicMetadata: { role } });

        return NextResponse.json({ message: 'Role assigned successfully' }, { status: 200 });
    } catch (error) {
        console.error('Error assigning role:', error);
        return NextResponse.json({ error: 'Error assigning role' }, { status: 500 });
    }
}
