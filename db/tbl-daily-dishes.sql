-- Table: public.daily_dishes

-- DROP TABLE IF EXISTS public.daily_dishes;

CREATE TABLE IF NOT EXISTS public.daily_dishes
(
    id integer NOT NULL DEFAULT nextval('daily_dishes_id_seq'::regclass),
    dish_date date NOT NULL,
    title character varying(120) COLLATE pg_catalog."default" NOT NULL,
    description text COLLATE pg_catalog."default",
    price numeric(6,2) NOT NULL,
    pos integer NOT NULL,
    is_out boolean,
    CONSTRAINT daily_dishes_pkey PRIMARY KEY (id)
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.daily_dishes
    OWNER to rudi;
