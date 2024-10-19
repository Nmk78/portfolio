import { NextResponse } from 'next/server';
import { getProjects, addProject, updateProject, deleteProject } from '@/lib/projects';

// POST - Add a new project
export async function POST(req: Request) {
  try {
    const project = await req.json();
    const addedProject = await addProject(project);
    return NextResponse.json({ success: true, data: addedProject }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to add project' }, { status: 500 });
  }
}

// PUT - Update an existing project
export async function PUT(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id'); // Get project name or id from the query string
    const project = await req.json();
    const updatedProject = await updateProject(id, project);
    return NextResponse.json({ success: true, data: updatedProject }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to update project' }, { status: 500 });
  }
}

// DELETE - Remove a project
export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id'); // Get project id from the query string
    await deleteProject(id);
    return NextResponse.json({ success: true, message: 'Project deleted' }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to delete project' }, { status: 500 });
  }
}
