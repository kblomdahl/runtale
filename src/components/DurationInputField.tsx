import { useState } from 'react';

function prettyPrintDuration(input: string): string {
  return input
    .replace(/\D/g, '')
    .replace(/(\d{1,2})(\d{2})(\d{2})/, '$1:$2:$3')
    .replace(/(\d{1,2})(\d{2})/, '$1:$2')
    .replace(/(\d{1,2})/, '$1');
}

function parseDuration(input: string): number {
  const parts = input.split(':').map(part => parseInt(part, 10));

  return parts.reduce((total, part) => total * 60 + part, 0);
}

interface DurationInputFieldProps {
  name: string;
  defaultValue?: string | null;
  className?: string;
}

function DurationInputField(props: DurationInputFieldProps) {
  const {name, defaultValue, className} = props;
  const [value, setValue] = useState(defaultValue || '');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(prettyPrintDuration(e.target.value));
  };

  return (
    <>
      <input
        type="hidden"
        name={name}
        value={parseDuration(value)}
      />
      <input
        type="text"
        value={value}
        className={['-duration', className].join(' ').trim()}
        onChange={handleChange}
        placeholder="hh:mm:ss"
        maxLength={8}
      />
    </>
  );
}

export default DurationInputField;
