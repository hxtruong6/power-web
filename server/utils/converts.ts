import camelcaseKeys from 'camelcase-keys';
import snakecaseKeys from 'snakecase-keys';

const convertCamelKeys = (obj: any) => camelcaseKeys(obj, { deep: true });

const convertSnakeKeys = (obj: any) => snakecaseKeys(obj, { deep: true });

export { convertCamelKeys, convertSnakeKeys };
