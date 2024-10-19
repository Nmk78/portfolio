import { NextResponse } from 'next/server';
import { getSkills, addSkill, updateSkill, deleteSkill } from '@/lib/skills';

// POST - Add a new skill
export async function POST(req: Request) {
  try {
    const skill = await req.json();
    const addedSkill = await addSkill(skill.name);
    return NextResponse.json({ success: true, data: addedSkill }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to add skill' }, { status: 500 });
  }
}

// PUT - Update an existing skill
export async function PUT(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id'); // Get skill name or id from the query string
    const skill = await req.json();
    const updatedSkill = await updateSkill(id, skill.name);
    return NextResponse.json({ success: true, data: updatedSkill }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to update skill' }, { status: 500 });
  }
}

// DELETE - Remove a skill
export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id'); // Get skill name or id from the query string
    await deleteSkill(id);
    return NextResponse.json({ success: true, message: 'Skill deleted' }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to delete skill' }, { status: 500 });
  }
}
