export enum UserRole {
  USER = 'USER',
  ADMIN = 'ADMIN',
}

export enum DefaultStatus {
  ACTIVE = 'ACTIVE',
  DEACTIVE = 'DEACTIVE',
  DELETED = 'DELETED',
  SUSPENDED = 'SUSPENDED',
  PENDING = 'PENDING',
}


export enum PermissionAction {
  CREATE = 'Create',
  READ = 'Read',
  UPDATE = 'Update',
  DELETE = 'Delete',
}


export enum QuizStatus {
  PUBLISHED = 'PUBLISHED',
  CLOSED = 'CLOSED',
}