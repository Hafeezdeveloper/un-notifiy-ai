// Mock data for departments
export const Departments = [
    { value: 'cs', name: 'Computer Science' },
    { value: 'ee', name: 'Electrical Engineering' },
    { value: 'me', name: 'Mechanical Engineering' },
    { value: 'ce', name: 'Civil Engineering' },
    { value: 'bt', name: 'Biotechnology' },
];
export const isNotEmpty = (data: any): boolean => {
    if (Array.isArray(data)) {
      return data.length > 0;
    } else if (typeof data === 'object' && data !== null) {
      return Object.keys(data).length > 0;
    }
    return !!data; // If it's a string, check if it's non-empty
  }