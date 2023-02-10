import { SearchIcon } from "@chakra-ui/icons";
import { Input, InputGroup, InputLeftElement } from "@chakra-ui/react";
import { Dispatch, SetStateAction, useState } from "react";

type Props = {
  setSearchWord: Dispatch<SetStateAction<string>>;
};

export const FeedbackSearchBox = ({ setSearchWord }: Props) => {
  const [isComposing, setIsComposing] = useState(false);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (isComposing) {
      return;
    }
    setSearchWord(event.target.value);
  };

  const handleCompositionStart = () => {
    setIsComposing(true);
  };

  const handleCompositionEnd = (
    event: React.CompositionEvent<HTMLInputElement>
  ) => {
    setIsComposing(false);
    setSearchWord((previous: string) => previous + event.data);
  };

  return (
    <InputGroup size="md" marginBottom={2}>
      <InputLeftElement pointerEvents="none">
        <SearchIcon color="gray.300" />
      </InputLeftElement>
      <Input
        placeholder="login or comment"
        onChange={handleInputChange}
        onCompositionStart={handleCompositionStart}
        onCompositionEnd={handleCompositionEnd}
      />
    </InputGroup>
  );
};
