import React, { FC, useCallback, useState } from "react";
import DropDownIcon from "../icons/DropDownIcon";
import BlankButton from "./BlankButton";
import styles from "./DropDownInput.module.scss";
import {useClickOutside} from "../../helpers/useClickOutside";
import {classNames} from "../../helpers/classNames";


export function mapStringToItem(val: string): DropdownItem {
  return { key: val };
}

export type DropdownItem = { value?: any; key: string };
type DropDownInputProps = {
  itemsList: Array<DropdownItem>;
  onChange: (item: DropdownItem) => void;
  className?: string;
  label: string;
  error: string;
  selected: DropdownItem;
  smaller?: boolean;
};

const DropDownInput: FC<DropDownInputProps> = (props) => {
  const {
    onChange,
    itemsList,
    className,
    label,
    error,
    selected,
    smaller,
    ...restProps
  } = props;
  const [isListHidden, setIsListHidden] = useState(true);

  const dropDownRef = useClickOutside(() => setIsListHidden(true));

  const handleSelect = useCallback((item: DropdownItem): void => {
    onChange(item);
    setIsListHidden(true);
  }, [isListHidden]);

  const renderValueItems = () => {
    return itemsList.map((it) => (
      <BlankButton
        className={styles.listItem}
        key={it.key}
        onClick={() => handleSelect(it)}
      >
        {it.value || it.key}
      </BlankButton>
    ));
  };

  const dropDownList = classNames(
    styles.dropDownList,
    isListHidden && styles.hiddenList,
    smaller && styles.smaller
  );
  const dropDownIcon = classNames(
    styles.dropDownIcon,
    !isListHidden && styles.rotateIcon
  );

  const getFieldValue = () => {
    return (
      <div
        ref={dropDownRef as React.RefObject<HTMLDivElement>}
        className={styles.dropDownWrapper}
      >
        <BlankButton
          onClick={() => setIsListHidden(!isListHidden)}
          className={classNames(
            styles.dropDownContainer,
            smaller && styles.smaller
          )}
        >
          {selected.value || selected.key || ""}
          <DropDownIcon className={dropDownIcon} />
        </BlankButton>
        <div className={dropDownList}>{renderValueItems()}</div>
      </div>
    );
  };

  return (
      <div data-cy="input-wrapper" {...restProps}>
        {getFieldValue()}
        {error && (
          <span
            className={styles.errorText}
            title={error}
            data-cy="input-error"
          >
            {error}
          </span>
        )}
      </div>
  );
};

export default DropDownInput;
