import { Button, FormControl, FormErrorMessage, Text } from "@chakra-ui/react";
import { useFormikContext } from "formik";
import React from "react";
import FieldWrapInput from "./Field.WrapInput";
import s from "./styles.module.scss";
import cs from "clsx";
import InputNumber from "rc-input-number";
import { ethers } from "ethers";

const FieldAmountFormik: React.FC<any> = ({
   form,
   field,
   step = 1,
   min = 1,
   max = ethers.constants.MaxUint256,
   placeholder,
   fieldChanged,
   rightComp,
   precision = 2,
   onMax,
   autoFocus,
}) => {
   const formik = useFormikContext();
   const { value, name } = field;
   const { touched } = form;

   const _meta = form.getFieldMeta(name);
   const error = _meta?.error;
   const shouldShowError = !!(touched && error);

   const handleChange = (e: any) => {
      formik.setFieldValue(name, e);
      fieldChanged?.(e);
   };

   return (
      <FormControl
         isInvalid={shouldShowError}
         className={cs(s.container, s.inputAmountContainer)}
      >
         <FieldWrapInput right={rightComp}>
            <InputNumber
               min={min}
               max={max}
               step={step}
               value={value}
               onChange={handleChange}
               decimalSeparator={"."}
               inputMode={precision > 0 ? "decimal" : "numeric"}
               controls={false}
               precision={precision}
               placeholder={placeholder}
               autoFocus={autoFocus}
            />
            {onMax && (
               <Button onClick={onMax}>
                  <Text fontSize={"12px"} color={"#ed8f00"}>
              MAX
                  </Text>
               </Button>
            )}
         </FieldWrapInput>
         <FormErrorMessage
            style={{
               fontSize: "12px",
               color: "#dd3b4b",
               textAlign: "left",
               fontWeight: "400",
            }}
            className={s.errorText}
         >
            {error}
         </FormErrorMessage>
      </FormControl>
   );
};

export default FieldAmountFormik;
