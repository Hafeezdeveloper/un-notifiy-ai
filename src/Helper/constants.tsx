import moment from 'moment';
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

export const truncateString = (str: string = '', maxLength: number = 10): string => {
  if (str?.length > maxLength) {
    return str?.substring(0, maxLength) + '...';
  }
  return str;
};

export const postTimeDifference = (data: string) => {
  const targetTime = moment(data);

  if (!targetTime.isValid()) {
    return '0';
  }}

  export function createMessageWithLinks(text: any): (JSX.Element | string)[] {
    if (!text) return [''];
  
    return text.split(" ").map((word: any, i: any) => {
      // Define the regex inside the loop
      const urlRegex = /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/i;
  
      // Check if the word is a URL using regex
      if (urlRegex.test(word)) {
        return (
          <a
            key={i}
            href={word}
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: 'blue', textDecoration: 'underline' }}
          >
            {word}
          </a>
        );
      }
      return word + " ";  // Return the word with a space
    });
  }