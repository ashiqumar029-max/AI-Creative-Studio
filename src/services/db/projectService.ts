import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  limit,
} from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../../firebase/config';
import type { Project, ProjectType, ProjectStatus } from '../../types';

export async function createProject(
  userId: string,
  data: {
    name: string;
    type: ProjectType;
    description?: string;
    status?: ProjectStatus;
    thumbnail?: string;
    isPublic?: boolean;
    tags?: string[];
  }
): Promise<Project> {
  const path = 'projects';
  const projectId = 'proj_' + Math.random().toString(36).substring(2, 11) + '_' + Date.now().toString(36);
  const now = new Date().toISOString();

  const newProject: Project = {
    id: projectId,
    userId,
    name: data.name,
    type: data.type,
    description: data.description || '',
    status: data.status || 'draft',
    thumbnail: data.thumbnail || '',
    isPublic: data.isPublic ?? false,
    shareSlug: projectId,
    tags: data.tags || ['Work'],
    createdAt: now,
    updatedAt: now,
  };

  try {
    await setDoc(doc(db, 'projects', projectId), newProject);
    return newProject;
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, `${path}/${projectId}`);
  }
}

export async function getUserProjects(userId: string): Promise<Project[]> {
  const path = 'projects';
  try {
    const q = query(
      collection(db, 'projects'),
      where('userId', '==', userId),
      limit(100)
    );
    const querySnapshot = await getDocs(q);
    const projects: Project[] = [];
    querySnapshot.forEach((doc) => {
      projects.push(doc.data() as Project);
    });
    // Sort descending by updatedAt
    return projects.sort(
      (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    );
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, path);
  }
}

export async function getProjectById(projectId: string): Promise<Project | null> {
  const path = `projects/${projectId}`;
  try {
    const docSnap = await getDoc(doc(db, 'projects', projectId));
    if (docSnap.exists()) {
      return docSnap.data() as Project;
    }
    return null;
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, path);
  }
}

export async function updateProject(
  projectId: string,
  updates: Partial<Omit<Project, 'id' | 'userId' | 'createdAt'>>
): Promise<void> {
  const path = `projects/${projectId}`;
  try {
    await updateDoc(doc(db, 'projects', projectId), {
      ...updates,
      updatedAt: new Date().toISOString(),
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, path);
  }
}

export async function deleteProject(projectId: string): Promise<void> {
  const path = `projects/${projectId}`;
  try {
    await deleteDoc(doc(db, 'projects', projectId));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

export async function duplicateProject(
  project: Project,
  userId: string
): Promise<Project> {
  return createProject(userId, {
    name: `${project.name} (Copy)`,
    type: project.type,
    description: project.description,
    status: 'draft',
    thumbnail: project.thumbnail,
    tags: project.tags ? [...project.tags] : ['Work'],
    isPublic: false,
  });
}

export async function getPublicProject(projectId: string): Promise<Project | null> {
  const path = `projects/${projectId}`;
  try {
    const docSnap = await getDoc(doc(db, 'projects', projectId));
    if (docSnap.exists()) {
      const data = docSnap.data() as Project;
      if (data.isPublic) {
        return data;
      }
    }
    return null;
  } catch (error) {
    console.error('Failed to get public project:', error);
    return null;
  }
}

export async function adminGetAllProjects(): Promise<Project[]> {
  const path = 'projects';
  try {
    const q = query(collection(db, 'projects'), limit(150));
    const querySnapshot = await getDocs(q);
    const projects: Project[] = [];
    querySnapshot.forEach((doc) => {
      projects.push(doc.data() as Project);
    });
    return projects.sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, path);
  }
}
