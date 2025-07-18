PGDMP  &                    }            bookrecommendations    17.4    17.4 B               0    0    ENCODING    ENCODING        SET client_encoding = 'UTF8';
                           false                       0    0 
   STDSTRINGS 
   STDSTRINGS     (   SET standard_conforming_strings = 'on';
                           false                       0    0 
   SEARCHPATH 
   SEARCHPATH     8   SELECT pg_catalog.set_config('search_path', '', false);
                           false                       1262    33389    bookrecommendations    DATABASE     y   CREATE DATABASE bookrecommendations WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE_PROVIDER = libc LOCALE = 'es-PE';
 #   DROP DATABASE bookrecommendations;
                     postgres    false            j           1247    33718    readingstatus    TYPE     n   CREATE TYPE public.readingstatus AS ENUM (
    'QUIERO_LEER',
    'LEYENDO',
    'LEIDO',
    'ABANDONADO'
);
     DROP TYPE public.readingstatus;
       public               postgres    false            g           1247    33712    userrole    TYPE     A   CREATE TYPE public.userrole AS ENUM (
    'USER',
    'ADMIN'
);
    DROP TYPE public.userrole;
       public               postgres    false            �            1255    33708    update_updated_at_column()    FUNCTION     �   CREATE FUNCTION public.update_updated_at_column() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$;
 1   DROP FUNCTION public.update_updated_at_column();
       public               postgres    false            �            1259    33620    books    TABLE     �  CREATE TABLE public.books (
    id integer NOT NULL,
    title character varying(255) NOT NULL,
    author character varying(255) NOT NULL,
    genre character varying(100) NOT NULL,
    description text,
    publication_year integer,
    pages integer,
    isbn character varying(20),
    cover_url character varying(500),
    average_rating numeric(3,2) DEFAULT 0.0,
    rating_count integer DEFAULT 0,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);
    DROP TABLE public.books;
       public         heap r       postgres    false            �            1259    33619    books_id_seq    SEQUENCE     �   CREATE SEQUENCE public.books_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 #   DROP SEQUENCE public.books_id_seq;
       public               postgres    false    220                       0    0    books_id_seq    SEQUENCE OWNED BY     =   ALTER SEQUENCE public.books_id_seq OWNED BY public.books.id;
          public               postgres    false    219            �            1259    33657    reading_history    TABLE     �  CREATE TABLE public.reading_history (
    id integer NOT NULL,
    user_id integer NOT NULL,
    book_id integer NOT NULL,
    status character varying(20) NOT NULL,
    progress_pages integer DEFAULT 0,
    start_date timestamp without time zone,
    finish_date timestamp without time zone,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT reading_history_status_check CHECK (((status)::text = ANY ((ARRAY['QUIERO_LEER'::character varying, 'LEYENDO'::character varying, 'LEIDO'::character varying, 'ABANDONADO'::character varying])::text[])))
);
 #   DROP TABLE public.reading_history;
       public         heap r       postgres    false            �            1259    33656    reading_history_id_seq    SEQUENCE     �   CREATE SEQUENCE public.reading_history_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 -   DROP SEQUENCE public.reading_history_id_seq;
       public               postgres    false    224                       0    0    reading_history_id_seq    SEQUENCE OWNED BY     Q   ALTER SEQUENCE public.reading_history_id_seq OWNED BY public.reading_history.id;
          public               postgres    false    223            �            1259    33634    reviews    TABLE     B  CREATE TABLE public.reviews (
    id integer NOT NULL,
    user_id integer NOT NULL,
    book_id integer NOT NULL,
    rating numeric(2,1) NOT NULL,
    comment text,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT reviews_rating_check CHECK (((rating >= 1.0) AND (rating <= 5.0)))
);
    DROP TABLE public.reviews;
       public         heap r       postgres    false            �            1259    33633    reviews_id_seq    SEQUENCE     �   CREATE SEQUENCE public.reviews_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 %   DROP SEQUENCE public.reviews_id_seq;
       public               postgres    false    222                       0    0    reviews_id_seq    SEQUENCE OWNED BY     A   ALTER SEQUENCE public.reviews_id_seq OWNED BY public.reviews.id;
          public               postgres    false    221            �            1259    33678    user_preferences    TABLE     �  CREATE TABLE public.user_preferences (
    id integer NOT NULL,
    user_id integer NOT NULL,
    genre character varying(100) NOT NULL,
    preference_score numeric(3,2) DEFAULT 0.0,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT user_preferences_preference_score_check CHECK (((preference_score >= '-1.0'::numeric) AND (preference_score <= 1.0)))
);
 $   DROP TABLE public.user_preferences;
       public         heap r       postgres    false            �            1259    33677    user_preferences_id_seq    SEQUENCE     �   CREATE SEQUENCE public.user_preferences_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 .   DROP SEQUENCE public.user_preferences_id_seq;
       public               postgres    false    226                       0    0    user_preferences_id_seq    SEQUENCE OWNED BY     S   ALTER SEQUENCE public.user_preferences_id_seq OWNED BY public.user_preferences.id;
          public               postgres    false    225            �            1259    33605    users    TABLE     �  CREATE TABLE public.users (
    id integer NOT NULL,
    email character varying(255) NOT NULL,
    full_name character varying(255) NOT NULL,
    hashed_password character varying(255) NOT NULL,
    role character varying(20) DEFAULT 'USER'::character varying,
    is_active boolean DEFAULT true,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT users_role_check CHECK (((role)::text = ANY ((ARRAY['USER'::character varying, 'ADMIN'::character varying])::text[])))
);
    DROP TABLE public.users;
       public         heap r       postgres    false            �            1259    33604    users_id_seq    SEQUENCE     �   CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 #   DROP SEQUENCE public.users_id_seq;
       public               postgres    false    218                       0    0    users_id_seq    SEQUENCE OWNED BY     =   ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;
          public               postgres    false    217            @           2604    33623    books id    DEFAULT     d   ALTER TABLE ONLY public.books ALTER COLUMN id SET DEFAULT nextval('public.books_id_seq'::regclass);
 7   ALTER TABLE public.books ALTER COLUMN id DROP DEFAULT;
       public               postgres    false    220    219    220            F           2604    33660    reading_history id    DEFAULT     x   ALTER TABLE ONLY public.reading_history ALTER COLUMN id SET DEFAULT nextval('public.reading_history_id_seq'::regclass);
 A   ALTER TABLE public.reading_history ALTER COLUMN id DROP DEFAULT;
       public               postgres    false    224    223    224            D           2604    33637 
   reviews id    DEFAULT     h   ALTER TABLE ONLY public.reviews ALTER COLUMN id SET DEFAULT nextval('public.reviews_id_seq'::regclass);
 9   ALTER TABLE public.reviews ALTER COLUMN id DROP DEFAULT;
       public               postgres    false    221    222    222            J           2604    33681    user_preferences id    DEFAULT     z   ALTER TABLE ONLY public.user_preferences ALTER COLUMN id SET DEFAULT nextval('public.user_preferences_id_seq'::regclass);
 B   ALTER TABLE public.user_preferences ALTER COLUMN id DROP DEFAULT;
       public               postgres    false    225    226    226            <           2604    33608    users id    DEFAULT     d   ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);
 7   ALTER TABLE public.users ALTER COLUMN id DROP DEFAULT;
       public               postgres    false    217    218    218                      0    33620    books 
   TABLE DATA           �   COPY public.books (id, title, author, genre, description, publication_year, pages, isbn, cover_url, average_rating, rating_count, created_at) FROM stdin;
    public               postgres    false    220   �S                 0    33657    reading_history 
   TABLE DATA           �   COPY public.reading_history (id, user_id, book_id, status, progress_pages, start_date, finish_date, created_at, updated_at) FROM stdin;
    public               postgres    false    224   j                 0    33634    reviews 
   TABLE DATA           T   COPY public.reviews (id, user_id, book_id, rating, comment, created_at) FROM stdin;
    public               postgres    false    222   �j                 0    33678    user_preferences 
   TABLE DATA           h   COPY public.user_preferences (id, user_id, genre, preference_score, created_at, updated_at) FROM stdin;
    public               postgres    false    226   �r       
          0    33605    users 
   TABLE DATA           c   COPY public.users (id, email, full_name, hashed_password, role, is_active, created_at) FROM stdin;
    public               postgres    false    218   8v                  0    0    books_id_seq    SEQUENCE SET     <   SELECT pg_catalog.setval('public.books_id_seq', 106, true);
          public               postgres    false    219                       0    0    reading_history_id_seq    SEQUENCE SET     D   SELECT pg_catalog.setval('public.reading_history_id_seq', 7, true);
          public               postgres    false    223                        0    0    reviews_id_seq    SEQUENCE SET     =   SELECT pg_catalog.setval('public.reviews_id_seq', 57, true);
          public               postgres    false    221            !           0    0    user_preferences_id_seq    SEQUENCE SET     F   SELECT pg_catalog.setval('public.user_preferences_id_seq', 67, true);
          public               postgres    false    225            "           0    0    users_id_seq    SEQUENCE SET     ;   SELECT pg_catalog.setval('public.users_id_seq', 43, true);
          public               postgres    false    217            X           2606    33632    books books_isbn_key 
   CONSTRAINT     O   ALTER TABLE ONLY public.books
    ADD CONSTRAINT books_isbn_key UNIQUE (isbn);
 >   ALTER TABLE ONLY public.books DROP CONSTRAINT books_isbn_key;
       public                 postgres    false    220            Z           2606    33630    books books_pkey 
   CONSTRAINT     N   ALTER TABLE ONLY public.books
    ADD CONSTRAINT books_pkey PRIMARY KEY (id);
 :   ALTER TABLE ONLY public.books DROP CONSTRAINT books_pkey;
       public                 postgres    false    220            j           2606    33666 $   reading_history reading_history_pkey 
   CONSTRAINT     b   ALTER TABLE ONLY public.reading_history
    ADD CONSTRAINT reading_history_pkey PRIMARY KEY (id);
 N   ALTER TABLE ONLY public.reading_history DROP CONSTRAINT reading_history_pkey;
       public                 postgres    false    224            c           2606    33643    reviews reviews_pkey 
   CONSTRAINT     R   ALTER TABLE ONLY public.reviews
    ADD CONSTRAINT reviews_pkey PRIMARY KEY (id);
 >   ALTER TABLE ONLY public.reviews DROP CONSTRAINT reviews_pkey;
       public                 postgres    false    222            e           2606    33645 #   reviews reviews_user_id_book_id_key 
   CONSTRAINT     j   ALTER TABLE ONLY public.reviews
    ADD CONSTRAINT reviews_user_id_book_id_key UNIQUE (user_id, book_id);
 M   ALTER TABLE ONLY public.reviews DROP CONSTRAINT reviews_user_id_book_id_key;
       public                 postgres    false    222    222            n           2606    33687 &   user_preferences user_preferences_pkey 
   CONSTRAINT     d   ALTER TABLE ONLY public.user_preferences
    ADD CONSTRAINT user_preferences_pkey PRIMARY KEY (id);
 P   ALTER TABLE ONLY public.user_preferences DROP CONSTRAINT user_preferences_pkey;
       public                 postgres    false    226            p           2606    33689 3   user_preferences user_preferences_user_id_genre_key 
   CONSTRAINT     x   ALTER TABLE ONLY public.user_preferences
    ADD CONSTRAINT user_preferences_user_id_genre_key UNIQUE (user_id, genre);
 ]   ALTER TABLE ONLY public.user_preferences DROP CONSTRAINT user_preferences_user_id_genre_key;
       public                 postgres    false    226    226            T           2606    33618    users users_email_key 
   CONSTRAINT     Q   ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);
 ?   ALTER TABLE ONLY public.users DROP CONSTRAINT users_email_key;
       public                 postgres    false    218            V           2606    33616    users users_pkey 
   CONSTRAINT     N   ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);
 :   ALTER TABLE ONLY public.users DROP CONSTRAINT users_pkey;
       public                 postgres    false    218            [           1259    33697    idx_books_author    INDEX     D   CREATE INDEX idx_books_author ON public.books USING btree (author);
 $   DROP INDEX public.idx_books_author;
       public                 postgres    false    220            \           1259    33698    idx_books_genre    INDEX     B   CREATE INDEX idx_books_genre ON public.books USING btree (genre);
 #   DROP INDEX public.idx_books_genre;
       public                 postgres    false    220            ]           1259    33699    idx_books_rating    INDEX     Q   CREATE INDEX idx_books_rating ON public.books USING btree (average_rating DESC);
 $   DROP INDEX public.idx_books_rating;
       public                 postgres    false    220            ^           1259    33696    idx_books_title    INDEX     B   CREATE INDEX idx_books_title ON public.books USING btree (title);
 #   DROP INDEX public.idx_books_title;
       public                 postgres    false    220            f           1259    33704    idx_reading_history_book_id    INDEX     Z   CREATE INDEX idx_reading_history_book_id ON public.reading_history USING btree (book_id);
 /   DROP INDEX public.idx_reading_history_book_id;
       public                 postgres    false    224            g           1259    33705    idx_reading_history_status    INDEX     X   CREATE INDEX idx_reading_history_status ON public.reading_history USING btree (status);
 .   DROP INDEX public.idx_reading_history_status;
       public                 postgres    false    224            h           1259    33703    idx_reading_history_user_id    INDEX     Z   CREATE INDEX idx_reading_history_user_id ON public.reading_history USING btree (user_id);
 /   DROP INDEX public.idx_reading_history_user_id;
       public                 postgres    false    224            _           1259    33701    idx_reviews_book_id    INDEX     J   CREATE INDEX idx_reviews_book_id ON public.reviews USING btree (book_id);
 '   DROP INDEX public.idx_reviews_book_id;
       public                 postgres    false    222            `           1259    33702    idx_reviews_rating    INDEX     H   CREATE INDEX idx_reviews_rating ON public.reviews USING btree (rating);
 &   DROP INDEX public.idx_reviews_rating;
       public                 postgres    false    222            a           1259    33700    idx_reviews_user_id    INDEX     J   CREATE INDEX idx_reviews_user_id ON public.reviews USING btree (user_id);
 '   DROP INDEX public.idx_reviews_user_id;
       public                 postgres    false    222            k           1259    33707    idx_user_preferences_genre    INDEX     X   CREATE INDEX idx_user_preferences_genre ON public.user_preferences USING btree (genre);
 .   DROP INDEX public.idx_user_preferences_genre;
       public                 postgres    false    226            l           1259    33706    idx_user_preferences_user_id    INDEX     \   CREATE INDEX idx_user_preferences_user_id ON public.user_preferences USING btree (user_id);
 0   DROP INDEX public.idx_user_preferences_user_id;
       public                 postgres    false    226            R           1259    33695    idx_users_email    INDEX     B   CREATE INDEX idx_users_email ON public.users USING btree (email);
 #   DROP INDEX public.idx_users_email;
       public                 postgres    false    218            v           2620    33709 1   reading_history update_reading_history_updated_at    TRIGGER     �   CREATE TRIGGER update_reading_history_updated_at BEFORE UPDATE ON public.reading_history FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
 J   DROP TRIGGER update_reading_history_updated_at ON public.reading_history;
       public               postgres    false    227    224            w           2620    33710 3   user_preferences update_user_preferences_updated_at    TRIGGER     �   CREATE TRIGGER update_user_preferences_updated_at BEFORE UPDATE ON public.user_preferences FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
 L   DROP TRIGGER update_user_preferences_updated_at ON public.user_preferences;
       public               postgres    false    226    227            s           2606    33672 ,   reading_history reading_history_book_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.reading_history
    ADD CONSTRAINT reading_history_book_id_fkey FOREIGN KEY (book_id) REFERENCES public.books(id) ON DELETE CASCADE;
 V   ALTER TABLE ONLY public.reading_history DROP CONSTRAINT reading_history_book_id_fkey;
       public               postgres    false    224    4698    220            t           2606    33667 ,   reading_history reading_history_user_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.reading_history
    ADD CONSTRAINT reading_history_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;
 V   ALTER TABLE ONLY public.reading_history DROP CONSTRAINT reading_history_user_id_fkey;
       public               postgres    false    218    4694    224            q           2606    33651    reviews reviews_book_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.reviews
    ADD CONSTRAINT reviews_book_id_fkey FOREIGN KEY (book_id) REFERENCES public.books(id) ON DELETE CASCADE;
 F   ALTER TABLE ONLY public.reviews DROP CONSTRAINT reviews_book_id_fkey;
       public               postgres    false    220    222    4698            r           2606    33646    reviews reviews_user_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.reviews
    ADD CONSTRAINT reviews_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;
 F   ALTER TABLE ONLY public.reviews DROP CONSTRAINT reviews_user_id_fkey;
       public               postgres    false    4694    218    222            u           2606    33690 .   user_preferences user_preferences_user_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.user_preferences
    ADD CONSTRAINT user_preferences_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;
 X   ALTER TABLE ONLY public.user_preferences DROP CONSTRAINT user_preferences_user_id_fkey;
       public               postgres    false    226    4694    218                  x��[�r�F�]��b@P� ���%;vb��,�����#�a �m�L}��-�RwǺ�uO� J�l&�D����t�>�3N���u�ď}]yal��|��xSuڪ��J��m�m��M�j�K�dc6���|���l��(�f�Ȓ���EP�I���$��u�No��NB�8�'A�Q,��,L���4�s��l"�(Y�Vɹ��i�n׻/���V�n�L��u3��Vuծ�|����J�0[�P�Z���RVғ���ZT�xm�ݗ�*��H����8��,d;�ъm2������E-[��cܪ�j|?�~���o+�H�R�[��b���� #�>$��	8�c�-~x����"����i:	�0��B�A�c��`(���4|�8�at�$g�贘��$�׽��� �X}�Weeď���o;݈f��R��z���ekf�S���P<���#~�,j�1j�u �(�{cz�O�a��8��6m>��8<K&��Σg9�X��`�w�^��u��(w_kD��A�l��P���)2쯽�;+˪팭8@��xTvV�eE&�"g��e"���`	�0O�i��ѧ$(a��	�1	-�o}uc:-�V����v� ���u��Iѯ��^J����XU<�s��QdCH�a��I3��_�%a�|\$.(V��_l|��j��˨WJ�p�a#\�ƨ�T�9P�Q>�8ſq!h/Fx#��"
q�� GRw����+�K^��Vo����ѿ4�e�#��4+�/}#��-u���� ����uSV�E�g��Ĺ��8�r�lE�{Ol��`�)�R�F�h��~�u-.)\�sx>��w_�D\zR��q�)K[�7�S��>v�I4��)h�,xR�^<d`����RW������V�g��r���eU��o���ؑ5d�����P�,����G�"�8˓$����Z �����
�����o�xiUs+_i;Ӷ;��/��������/��-X�#�e����(�� �4l'@M��,
�x�3Z���󍲆)gNɭ-��Z��fn�+e��J���nQ�Ā�gHk?�V����{�������j�SQG�i*��j��Y��Jk�I�Ag�`�-Pu��x�!mF���"q��pm{&/5UÕ�Q.(2L~�W��j6j)�X�H�l�=ϭ���-{$^D���ԗ��tgq���Y��8�$6x,n �Yͬۨވ(�P��·����Vׄ�-Ё��8V��q�/��A��6N��J��Q$� �
�a�I���V�3���L<���_$F��U���L����vO��yPkY����i��5��E��*FI��aA�zs�}��x?��z�k�Rћ�U���S�UӎY{}�U�*���+��&2^���o�$��Wpt�+(D����?��X�`rx	�gC�o.!e)R��Ҷ+���IF�zi�3uА����FSL���S ��@B��� r/�B�œ(J�)9��C����T�5G^*��
���m�O�ݮ�)���B9j�E���cʾ�� M�����>�ҟ�7��9GEi� �Ɔ2��h�ם���z	[?U�B|D�K��j�Z�+�`�!CYg"h���T��_���H&�3EI1h��4ɧ�����h��,	Ϣ�4.�Q:}6a�UMhA_;�T�>.!�[b-X��GXx��<ւP[0��s���|����j��"����|G�D��q�
߃D� �ȕ�0a%kK���0��Z5�"�T�t������wT�ϳ�������@YV�kt���Z�ݯP�+��L2����+P#y	������������Ϊ�Tm5��)˙io�hc�l�i������Y�G��gd��7i{˫*�$�P=D͜��j�9���aJF~_�+=���!;��x���z�9Ď��7p1@��,՚�2ڞ�IMW9�v<�8�I�1�8��car/R����ٵ���h߫Z-����'6�n�.,����՜�Ĳ�O�qE:�޼�3�
%��")f
�u0���|`	9� �|_�-b�D�����T}���G3T�Y �@`YOAj �eg�1��I\$��d6X���xE��� ���T4p����(�
E-K��Ls1(�[T��}�#� �ý��Q��Q5N+[h�^TT��H�b�jI�x��z��������f���f����bq�(�ou�!��~���U
��҆Ʌ��h��s#ϗj�YHBU�1��B����#QB���_�`R��=���x(ު�9�j�ʍgHY�|����j��ffA�6�׮�����n���@hK�J�x�ŋ�_~9�!Dhd��\LŊ�C�M��c�Ş"�g��8i���Q�:�+
���Z$���{~�7G�th!�#��f|;5[�� ��iH�'�XL��Eb���]JA�蕝W��פ2G7F�xzy�Z�,]���s�:��S�f�eR��k�ۿ	=%2/��Y1����8�����p�R�ܵ�[/�}�)Է��}�n]L���]qAUҚ���z^k�h����HVM�$��J���	�M&F��������ˡ�ĲV�
���-��=�B���13(�`#	�L���	�+?Ȓq$B�8�0���fiJ��&Kk�y,�	ŊO�=���Bͫ�nѭ���;�Z�hZ�����M��ʣ��Hѭo�5�3i.���[�&�2�)U�r��B8f�Lh|6�A��D�Ϙ� `L��N���}.Ia=G�ȫ����^�>��J�n6
�������(�41�Ԟ�I��\x�������s?��je������	{���{��O�������L"%p�x���J�+$(�8S��}C'�tI�z��w�H3a��Ū���%y��?X��aV��i<���8[s!ӥ�z`E�A����F�l�!�Өg�Y�&�\�(���q�������9�9���x�#~4K�B�����8&��`��y�1@.����Uw��cl�c���:�Ǒ��_r��>i�Ig5�g��kyfjN\�r2f�O5�'hG�pY\ �"�>�i�f��a����	F0�)�Qz6����4IP�g�T�XA����s6�s�I��h��7P&�,[< �&S>��j����n�_�@�`�w-�����T^�����~<���"�N�h!�y�GlVV4ϤҮ��5�+s"�?��/M߲Vw����n�MV�֬IE2�q��-=��kK�u����,���T�m !*!z��9Rq%F�W����C��m�9�7I��b�G�[E�f��%�ԍ;��������ǡ�3H�Xx�y��z�i�O��3�*��t���W�=!��
`^�y��̾u��@���nm{=㷲�Usǻ����o�N�k���I1I�)�?Q!��,����)�f��<��
����	���KY�m��5
���ތ��?��H��h�U3���v<�R;WA¶tfAR�}�l{"�t"��ϒ7GS�U��J���~�y��T�귺���S�rz�8���
�J_s��������rs��>hů��x�P"���g#��V}�tr���ߞ�������(�7��P���@C�i'�g<��ȹQ�	�"�]~)�w�KSP��E�&�%:{��������l���	�GaT�'� I�!H��H�<��D^F��2�
��,L���4	�"���͏�V�O�	�t�Ȼ�yY��B%���Z6�?V
c
"����zmJ^s9�Qh#o��������9DR�m�����xd��%]I#E�[�&�C� Yl���åf8M[u�6�������ONo\Dk*�@�L���Y��L�θs�E�jT[)ڸ��Y *VwM�����V���<�&�� �pz�,�qh��w�X��6]:*?�Q�5��i�9Ǉ�tj�d 1�l��-�/C�k�eR�0�@`�Zxx<�=��>����*�Svڒ'�h')���t'Y�,�Q�UU��Pߣ{���z�p'@��8^X�[�AF��8��,�����A}��j�B�tYy����V� �Ѫ��"�=5*t��F9���w�[���:=�&IK,{ F  X<�����mif����T{�~�צ����4~
�4�WRU-h�8B����0�f�9�9�nuZҴ%�ƾ>��=io�.�C��_�Ӭ7�G}F.��s/tKp)���|@��/k�X�k7㸕g�E�_�*pv���e��5b,T���U<�;x������x�BO#gͺ'iݪxHB�;��G"�<�Ȓ·�6طz$j|�&�į��Ƿ����J/z*�k:y��S����ԅr� ��{ ����X.����i��)k'�U߂�7/p�ܷOd�'0u$L�����'�l�}�v������pP)����,ܜ��7���i�������Xߖl�X�	�k�}q���?��Fb�����g�%�	�7�W)�@^i���]��c�⢿1O���w�}��N�Ƌv�!��{H�D�x�8r�V5�5�Ź��J`�R�N��t2�vw����ԍ��/O�b?m�~������l��h{��$07=kiD�J����Q�_q6�hU˜8�|�_{3���� 4NTh�U:��k�A������_����P]�v�F�a1�7�u�AE�y�׶��[�t�΂�-��A*�u�A��i��1��@����R��?\�"J�[�=Ϩ����[E�6��)�ɭ%Ϩ6�֏��W��/7��.� �=��G��AP��zE_Y��y����զ���ǋ~H/'��؆�7��d���xq��*:,!�Q�Տ��,�gh�J��������t7o�)b?�GO�  : �X�)�9B�����<S
�� �ºS�� a�O� B��)U���F G��}���В�g��c�O�s��Н��oc_�n2�w��)T����^�v�
�D$JL�P�f��c�fp"5�G|Nz4�H?F̤]5�WRƬ����I��T2�5ea�F�E����aA�A7��ҏ��=��q0��yHg��xh@�7�H1Q�O$E��a`ȑ2��ď�ȵE!_����x0���֚�\�/T���*��\U��Y}aZ��4�jc�7����L���-�$Cב�ܒ�@9�G/ !~4�R�O�/kb��=�d܌� Qi�?�g:]6��iQw&��j 0���1�_�Z�{����Hբ6��|�����3¡j�&C]ﾐ.�F&�"�}���8
F��ST��3���V��*S˫�|�P��\�kj����:�������'ʷY"��>�|�)��.h5��&��˂q,��Z���'��v����cG�'-���lVuOw"o��.�zf�sS�D���ˡ���
1�ܪ=t�R������~��f��;�B��Y����<�_ Vۧ3��Afvt�xz��n���s�$œl?IA�
�І��=r�2���J���$��ʏ��p�2��ҏ�i��K��cA�:�����ӧC�������55Tꘉ�x�g�o�?��q������N�]]ڣvw���nOC��=�9r�u?�TtA�U:�9n{�O+M�fv_k?��E�n����<�V�@��.�6����Q�'��v���-��Z�o�dwb�6���q��uq3����p��<����gϞ�?,)<         �   x�}�1
�0���:�/#ɒlyKi�BI�B��:�&m���O����q����8�4�&�J尭���+��y�����9�7��5���ObV�/����|�{�l5ܟ�y䠢.����=��DҦ�Ol2�%2�NR�)l	 >��J�         7  x�uXI���]�����0r�)�U�
���x��Ȭ�T(�t�Zj��CG���~& ���d	���7�T��I��k�|��щ�2��ō�L�6R��ʼ\xT%���Ѵ;��i���&K�iQ�\�J<-��������M���i�7���ѱ��yok�fվ>�����?�+3Z�7�u��$q#2&R$�|-�J�|U��*��g�{�Y�m��mg؝n{ݍ_z�sk��xr�Z�H�x��F�u�\�O�D�?��n���e�!����H����ܛڰ��ĶִSPuÑo�Q|�f��\	�t��H�~`�t��n�:]{�5�v�����3ݚ���i0;�'N�k�N��썯�g���E�gB�L_8�Z�D���c1��G���xw���A�[k��ùOLG���l�8����w��6��s��	��6@����*A�2Q8����0��D�iug_;{�ݔ�Ѳ�����E�K�T�N��X��z(��}�{�);7����ǟ�k)�ð����K�$��i>hT,W"K�x�~3�ʛڵ��P���]@�������7���@d9�)V+ 	i�y���>�/2֬tj���� �X��mc.} D��hJ�!d�B�p�c������̀Q"j �����B��'��[�0��Ff���Z��|tBR�����6W�"x"4�S�͢�d��d@��+*��]d	8�Nf�n�7�lv
���"_�VmT���U����|�1CX����
s����/0��\Lj�	�̋��G"I��f��t�e��4�5{�j�}��`�F52PJ�k�e!�����n��~�-
%i����
8���h�8�Q$E1kf~��O�y@;�T��ޜ���G*Rر����y��~IP	.��i�tK���ޜ���Y�I��?�O:����9���L7�=�j�~�ސ�/�Vc|bb�D[TR����{�4{{� �%�E�Gm?�#M6Jۈ�P�f94����ʉ�2OP�౴[��A����Կ;������GA��и��/&,�(	�L�&2�"A�g�v,�H��ҏ���['o��/5#:��GG�2���D��lg��c�-k� �@��_�G�u��H0�l�����ьL�>��v��I��'��z��{������&�X4�;`�O�T<Aetп�ְ׀LDgC����}��'2�����\"�V.�DP_��*��[�{�l�'+��G�7n��1>d�#�r���@Sxt�[�	(<:�Q�	=�X@X��l�����K��EZ�,V*AY��/D���n Z����&���㎤�R���gª4A�Y��鶵[ �|�@ధ�ֶMF�-I��HH1R�*��hV���A�	����_K�x�ב�
pN�2V����4�[W�̚��N�u�8p���`�Ò(Iv4ב{
�@�TUP�8z�\F?i	�Л�共b_�EX�f�)T�^ٟ���-��=��H�A�G��*A~"._�`%Κ����:7c7r�D�0��ɓ�H�'�9���͸lC���s= `����=Z��&��'��iRr�5�,	R��l��z���ABiH�0�~����ݕ3�R� �L��j(�AC	h�(��ّ����&��x�^��W)�R$�|��!3w�^~MX��<R9p��J�͠��̮4M�qeP���o��fg:?�GM�@�hE\����m��|	�H')����������~B���v6ı��G`&�l��,Fq3�Ҝnc�[����-��S����'�?����`�I��ģ	�7�Q�F�u�VB�H� �q;W�����UXN�/��������y^�t0��h	��ϴ�H*r�f�v��^?�oT
(�T�����<:�m,�,3\�`�z�X1��3!e*�PU͸�wO��?�@�@Y)�V�B�C�7B�����N~2:�u��&�q)�b��-����b�%Y��_e)�w��_j�էK$A_���B��������>/��V�ߑf�����U�u��/a��4���B
�w�r�Q}Qef�7�:��pQdY���z�Z���p         6  x���Kn�0���)t�|SԮ�E�A�e6���dɠ�=��U���uh�$��z���g��/��G]5�_w��_�e�`9�N�:����R�R񼠪��%$3�J�Kase5U��0�OͰ��朎�欤"|-�䂿�ڒ�QcYA$�E�n�~��"$;Kb@zW#���q ~�����Wo�u�V��H ��V��u,r%�#R����]�*�p˥�o(�T ���m��g��&R���1J��,�扒}����P�hX���v�U�j3<��H|�R�1��H���D��8���־�.�4h*�bc�y�q�mwUIӢ!E#o|��+_������!N�8P����+��+H0�DK�7�x�v���E�p+KT؄�8�����lj��pG`���x�4�,��%
���5��Z��{w�Ѹ�5��Xwul4.\]M�1/�#�5D^�n]��zc�e7�� ��a�u0�+8��hb׫QD�_��M���1\�J¿���|��:T�ۻ��},p��h��� )�s+���cv��K��q�g\FK!sM�(�
w���#���Ⲕ�/��T�AvҔR�
��X" �\�ɖ�=G紫��U!�yǐ���IN�U� �eI�8c��� ��eJ��5n��PA�Ȼ��G�[����zgY^#�w�E)T.����3����4���ڟ4fPr��@Aa�'ނ�|�Zj��	46��(A^qg���O���=���N�ȱ0fLl5lôaL�W`����"�\K1��)6!�z�B��I�g      
   �
  x�uX���H��+0��L�e�@�U�E;))�w�͘m<�c>�~l�z]��7����ȋqN���s%�P��U�o?AAL�Yғ?;���������8Ϊ��� E�?�����ޙ��+g1��u�����{�r�Bf�v`��?��$YD�����dӫ{��ܿh�_�@��fހHdž�C���*K_Y�h(mp<��3*��ּ��=>�:ע���G\ݖu�Xq*>P��:ub֊|�\re4���=/Z��d�
��@F`��&�� �CރC�%�D9G��f*�G�ݯ�l����E��S���݈����zt���Wϭ���r� t��F�3G�"� ����k�F��&����ԥ���Q�Ͳ���5��|�t�r�ǜX��M� �c�� +Q,��3%���	�n�*ǟ��h1-��۝�	��h�I㬳D`���gC�ig��j�Q�Ͻ��$�R0=��'_����.���߳���m��"�6X�u#[�U������Ť򂻩�?oI��]�����#r|�=W�|���Hc�Vx�o�� �Ż�-��t��}.��JemhZ7o�q~^
5���I�3W6�8��%��Hp=/����*��o�ߕ���x�KV7���ֶU�@.M$i�֪:�m����l$$w�]Cʿ@��B���w^�?y�s����FRiOv��'!Y�A�9h�F�6�� .OW�4����'����1�N|�� � ����UM4����S�����]A֛y�H߸1k���1���i*��)mY��tz�˱�n%�P�
�

��	�w�eJ���?��B(|��
�
[����K_J��KR�뭻k��w^MȰf�z�&�ٽ��(�� ���Ի഼��=�d
�,q�������ߗb>*ۋ8��h)��(��u��,w�����[�$�>�yrlҽ]�:
����"�x~����;W+��\��6�-��^>��"Q����c�Q��LMj�N��)Qh�0 ��8yM��#0_p�}�j��x������8�<����\MZό�iL/ظ��6}�i7>#R�D3ׇ��_�Oj�dI��ͯa�7t�k0]KvS7]��`Lm��1���V�JZ4�%ZS�ٻ��J��P|��~���>dza����8.����`��_�`VǃǊ�bL��|J9�a��1����9
�B�D�ሇ>�O�եX8�����D
a��D�F�(��`D���(�$ ���|��+�U�z��Lÿ=�Q{�n΁�m#���iiC�q_kpޕ��u� ��$���|<�ˠ�5F�,BUL��u���#ף�d5�YkKkI�- �ڶ�;t��j����	C3و�'��w�����U(p���1T_�Ԛ6�#$?j�5n�{HR�̵�ɟM�N&!��#6�w��"A҅���ܿ��Gd��������^�b��$��>�'p���a�B���PS֙��b�[1�1����X��d(�"c�~�|N(!^%���#=F�z��C5(F�n���m����ԣu�F��S	0�%7Y����q�d%�d��� R/�Dz�W9^���þ�a����M�0/��r5邟���ܬ��-R��)]��q���E >��xA��݋���o$~F&Q��:���\˝ڤ�e+�:�4��!����P���H��>��GX���V�L@��H�I���x�Wx�د�`�E�Q-f1���c�,N�x��x��躔�-�֍e� ���]= ����(r}������a7QC�'��@ku�&+|�f������!H������{�f���F�5�Ӗp��NfB��7����@�RT�`}�zQ�^���D#�]5^�M1F�0��Ut7���?�#o(��t�C��D��I�Y�__T}c�!:���'*�]�J�֖�-[� ��N�[[�$��2[1�X�סj�Uq;p��B �h���o~�~s�X���,��0w9�V&�bSw���k����0m\}_zf�2��Ipr�@RV���=�l��D�#0ؠ$�>�g�e�X��;C���z�o��e8
��՜P��"��UvhG��w���˃>#�����΍��Y�:H��Y>s�f&��:����>X�j�k�j�z�Vg�(���$%��4o®�8r3R�q���s/����c0���($�-SJ���RhSC��:�G�����7��\]���؎���{c!%�
�$R�$���*�d��'�^,��0T��<��w��Yv�9����V�.��Y�����>"�L���K��7��!�A�t�$+��<?����
N���p�?��6��������_��qq��뱺uo��<��	8����X�ς^���ŷ�|И�$|��L�.��=�0�|ܬkIQ�Tؔ�Ȏ������G%�#�&��P��RA�-da���}�{��<?�����D!?��<q����qC�(/A6GB�Nf���Ny��Ʈ7��j��u�$J�ŧ�L�P8>߃Q���p�nW*W#�L+֦f�̨®F�q���9EV *˝���h�n�aW
OC$�d�=���p����^@�r���W��a5M�ї��4k���s��Y[ж�p��T�e[�U��as�W�Z�_FZ��5yd+�g�C��Aj�G�ɯ��P?~���P�?����<�=�?϶�iB'����n�١
��]ō�����1<��L�z����W~p �7���GL�ӟT����e�6     