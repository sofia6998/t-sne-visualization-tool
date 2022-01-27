import SettinsIcon from "./icons/SettingsIcon";
import styles from "./SettingsOverlayModule.module.scss";
import React, { useEffect, useState, useCallback } from "react";
import { classNames } from "../helpers/classNames";
import BlankButton from "./common/BlankButton";
import Slider from "./common/Slider";
import { usePlotContext } from "../contexts/PlotContext";
import { ITsneParams } from "../tsneWrapper/TsneWrapper";
import DropDownInput, {
  EMPTY_DROPDOWN_ITEM,
  DropdownItem,
} from "./common/DropDownInput";
import Input from "./common/Input";
import ThemeToggle from "./common/ThemeToggle";

type DropdownItemName = 'colorField' | 'sizeField' | 'nameField';

const SettingsOverlayModule: React.FC = () => {
  const [open, setOpen] = useState<boolean>(false);

  return (
    <>
      <BlankButton
        onClick={() => setOpen(o => !o)}
        title={open ? "close" : "open"}
        className={styles.button}
      >
        <SettinsIcon />
      </BlankButton>
      <div className={classNames(styles.settingsContainer, open && styles.opened)}>
        <ThemeToggle />
        <TSneParams />
        <StyleParams />
      </div>
    </>

  );
}

const StyleParams: React.FC = () => {
  const { preprocessedDfColumns, styleSettings, setStyleSettings } = usePlotContext();

  const [dropdownItems, setDropdownItems] = useState<DropdownItem[]>(
    [EMPTY_DROPDOWN_ITEM],
  );

  useEffect(() => {
    if (!preprocessedDfColumns || !preprocessedDfColumns.length) {
      return;
    }

    setDropdownItems(
      preprocessedDfColumns.map((dfKey: string) => ({ key: dfKey })),
    );
  }, [preprocessedDfColumns]);

  const getChosenValue = (item: DropdownItem): string => {
    return item === EMPTY_DROPDOWN_ITEM ? EMPTY_DROPDOWN_ITEM.key : item.key;
  }

  const handleOnChangeColorField = useCallback((item: DropdownItem) => {
    setStyleSettings({ ...styleSettings, colorField: getChosenValue(item) });
  }, [styleSettings]);
  const handleOnChangeSizeField = useCallback((item: DropdownItem) => {
    setStyleSettings({ ...styleSettings, sizeField: getChosenValue(item) });
  }, [styleSettings]);
  const handleOnChangeNameField = useCallback((item: DropdownItem) => {
    setStyleSettings({ ...styleSettings, nameField: getChosenValue(item) });
  }, [styleSettings]);
  const handleOnChangeOpacity = useCallback((newOpacity: number) => {
    setStyleSettings({ ...styleSettings, opacity: newOpacity });
  }, [styleSettings]);

  return (
    <>
      <div className={styles.filterTitle}>
        Styling parameters
      </div>
      <div className={styles.paramsGrid}>
        <div className={styles.paramTitle}>Color Field</div>
        <DropDownInput
          itemsList={dropdownItems}
          selected={styleSettings.colorField
            ? { key: styleSettings.colorField }
            : EMPTY_DROPDOWN_ITEM
          }
          onChange={handleOnChangeColorField}
          label="Color Field"
          error=""
        />
        <div className={styles.paramTitle}>Size Field</div>
        <DropDownInput
          itemsList={dropdownItems}
          selected={styleSettings.sizeField
            ? { key: styleSettings.sizeField }
            : EMPTY_DROPDOWN_ITEM
          }
          onChange={handleOnChangeSizeField}
          label="Size Field"
          error=""
        />
        <div className={styles.paramTitle}>Opacity</div>
        <Slider
          defaultValue={1}
          max={1}
          min={0.01}
          value={styleSettings.opacity ?? 1}
          onChange={handleOnChangeOpacity}
          step={0.01}
        />
        {/*<div className={styles.paramTitle}>Name Field</div>*/}
        {/*<DropDownInput*/}
        {/*  itemsList={dropdownItems}*/}
        {/*  selected={styleSettings.nameField*/}
        {/*    ? { key: styleSettings.nameField } */}
        {/*    : EMPTY_DROPDOWN_ITEM*/}
        {/*  }*/}
        {/*  onChange={handleOnChangeNameField}*/}
        {/*  label="Name Field"*/}
        {/*  error=""*/}
        {/*/>*/}
      </div>
    </>
  );
}

const TSneParams: React.FC = () => {
  const { tsneParams, setTsneParams } = usePlotContext();

  const [epsilon, setEpsilon] = useState(tsneParams.epsilon);
  const [perplexity, setPerplexity] = useState(tsneParams.perplexity);
  const [numSteps, setNumSteps] = useState(tsneParams.numSteps);
  const [costThreshold, setCostThreshold] = useState(tsneParams.costThreshold);

  const handleOnClickRefitButton = () => {
    setTsneParams({
      ...tsneParams,
      epsilon,
      perplexity,
      numSteps,
      costThreshold,
    } as ITsneParams);
  }

  return <>
    <div className={styles.filterTitle}>
      T-SNE parameters
    </div>
    <div className={styles.paramsGrid}>
      <div className={styles.paramTitle}>Epsilon</div>
      <Slider
        defaultValue={50}
        max={100}
        min={0}
        value={epsilon}
        onChange={setEpsilon}
        step={0.5}
      />
      <div className={styles.paramTitle}>Perplexity</div>
      <Slider
        defaultValue={50}
        max={100}
        min={0}
        value={perplexity}
        onChange={setPerplexity}
      />
      <div className={styles.paramTitle}>Steps number</div>
      <Input value={numSteps}
             onChange={(v) => setNumSteps(parseInt(v))}/>
      <div className={styles.paramTitle}>Cost threshold</div>
      <Slider
        defaultValue={50}
        max={100}
        min={1}
        value={costThreshold}
        onChange={setCostThreshold}
        step={0.5}
      />

      <BlankButton
        className={styles.refitButton}
        onClick={handleOnClickRefitButton}
      >
        Refit
      </BlankButton>
    </div>
  </>
}
export default SettingsOverlayModule;
