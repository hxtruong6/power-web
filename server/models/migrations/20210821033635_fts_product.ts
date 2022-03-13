import { Knex } from 'knex';

const vnUnaccentFunction = `
CREATE OR REPLACE FUNCTION public.vn_unaccent(text)
    RETURNS text
    LANGUAGE plpgsql
AS $function$
    DECLARE
        input_string text := $1;
    BEGIN
        input_string := translate(input_string, 'áàãạảAÁÀÃẠẢăắằẵặẳĂẮẰẴẶẲâầấẫậẩÂẤẦẪẬẨ', 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa');
        input_string := translate(input_string, 'éèẽẹẻEÉÈẼẸẺêếềễệểÊẾỀỄỆỂ', 'eeeeeeeeeeeeeeeeeeeeeeee');
        input_string := translate(input_string, 'íìĩịỉIÍÌĨỊỈ', 'iiiiiiiiiii');
        input_string := translate(input_string, 'óòõọỏOÓÒÕỌỎôốồỗộổÔỐỒỖỘỔơớờỡợởƠỚỜỠỢỞ', 'ooooooooooooooooooooooooooooooooooo');
        input_string := translate(input_string, 'úùũụủUÚÙŨỤỦưứừữựửƯỨỪỮỰỬ', 'uuuuuuuuuuuuuuuuuuuuuuu');
        input_string := translate(input_string, 'ýỳỹỵỷYÝỲỸỴỶ', 'yyyyyyyyyyy');
        input_string := translate(input_string, 'dđĐD', 'dddd');
        
        return input_string;
    END;
$function$
`;

const addProductIndex = `
ALTER TABLE public.product ADD "product_tsv" tsvector;

CREATE OR REPLACE FUNCTION product_tsv_trigger_func()
RETURNS trigger AS $$
BEGIN
    NEW.product_tsv = setweight(to_tsvector(coalesce(vn_unaccent(NEW.title))), 'A') ||
	                setweight(to_tsvector(coalesce(vn_unaccent(NEW.sku))), 'B') ||
	                setweight(to_tsvector(coalesce(vn_unaccent(NEW.description))), 'D');
    RETURN NEW;
END $$ LANGUAGE 'plpgsql';

CREATE TRIGGER product_tsv_trigger 
BEFORE INSERT OR UPDATE
OF title, sku, description ON product 
FOR EACH ROW
    EXECUTE PROCEDURE product_tsv_trigger_func();

CREATE INDEX product_fts_idx 
ON product 
USING GIN(product_tsv);
`;

const removeProductIndex = `
  DROP FUNCTION IF EXISTS product_tsv_trigger_func();
`;

exports.up = async (knex: Knex): Promise<void> => {
	console.log('Create product index');
	await knex.schema.raw(vnUnaccentFunction);
	return knex.schema.raw(addProductIndex);
};

exports.down = async (knex: Knex): Promise<void> => knex.raw(removeProductIndex);

// Dump update: UPDATE products SET sku=sku;
