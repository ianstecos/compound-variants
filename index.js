// Import clsx for class name concatenation
const clsx = require('clsx');

// Check if all properties in subProps are present in superProps
const isSubPropsInSuperProps = (subProps, superProps) => {
  for (const key in subProps) {
    const subValue = subProps[key],
      superValue = superProps[key];

    // Check if the superValue is an array and includes subValue
    if (Array.isArray(superValue)) {
      if (!superValue.includes(subValue)) return false;
    }
    // Directly compare the values
    else if (superValue !== subValue) {
      return false;
    }
  }
  return true;
};

// Create a function for generating CSS classes based on variant props
const createVariantClass =
  (config = {}) =>
  (props = {}) => {
    const { 
      base = [], 
      variants = {}, 
      defaultVariants = {}, 
      compoundVariants = [] 
    } = config;
    
    // Merge default variants with provided props
    const mergedProps = { ...defaultVariants, ...props };
    const styles = [];

    // Process compound variants
    for (const {
      apply: applyClasses,
      ...conditionalProps
    } of compoundVariants) {
      if (isSubPropsInSuperProps(mergedProps, conditionalProps)) {
        styles.push(applyClasses);
      }
    }

    // Process simple variants
    for (const key in mergedProps) {
      const propValue = mergedProps[key];
      if (variants[key]?.[propValue]) {
        styles.push(variants[key][propValue]);
      }
    }

    // Concatenate and return all CSS classes
    return clsx(base, styles);
  };

// Export the createVariantClass function
module.exports = createVariantClass;
