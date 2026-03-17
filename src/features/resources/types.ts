export interface Resource {
  id: number;
  title: string;
  description: string;
  url: string;
  category: 'course' | 'article' | 'tutorial' | 'video' | 'documentation';
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  tags: string[];
  completed: boolean;
  createdAt: string;
}

export interface ResourceFormData {
  title: string;
  description: string;
  url: string;
  category: Resource['category'];
  difficulty: Resource['difficulty'];
  tags: string[];
}
