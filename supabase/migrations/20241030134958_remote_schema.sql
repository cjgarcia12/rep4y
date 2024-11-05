revoke delete on table "public"."subscriptions" from "anon";

revoke insert on table "public"."subscriptions" from "anon";

revoke references on table "public"."subscriptions" from "anon";

revoke select on table "public"."subscriptions" from "anon";

revoke trigger on table "public"."subscriptions" from "anon";

revoke truncate on table "public"."subscriptions" from "anon";

revoke update on table "public"."subscriptions" from "anon";

revoke delete on table "public"."subscriptions" from "authenticated";

revoke insert on table "public"."subscriptions" from "authenticated";

revoke references on table "public"."subscriptions" from "authenticated";

revoke select on table "public"."subscriptions" from "authenticated";

revoke trigger on table "public"."subscriptions" from "authenticated";

revoke truncate on table "public"."subscriptions" from "authenticated";

revoke update on table "public"."subscriptions" from "authenticated";

revoke delete on table "public"."subscriptions" from "service_role";

revoke insert on table "public"."subscriptions" from "service_role";

revoke references on table "public"."subscriptions" from "service_role";

revoke select on table "public"."subscriptions" from "service_role";

revoke trigger on table "public"."subscriptions" from "service_role";

revoke truncate on table "public"."subscriptions" from "service_role";

revoke update on table "public"."subscriptions" from "service_role";

alter table "public"."profiles" drop constraint "profiles_user_id_fkey";

alter table "public"."subscriptions" drop constraint "subscriptions_subscriber_id_fkey";

alter table "public"."subscriptions" drop constraint "subscriptions_pkey";

drop index if exists "public"."subscriptions_pkey";

drop table "public"."subscriptions";

alter table "public"."profiles" drop column "birthday";

alter table "public"."profiles" drop column "city";

alter table "public"."profiles" drop column "country";

alter table "public"."profiles" drop column "firstname";

alter table "public"."profiles" drop column "lastname";

alter table "public"."profiles" drop column "phonenumber";

alter table "public"."profiles" drop column "state";

alter table "public"."profiles" drop column "streetaddress";

alter table "public"."profiles" drop column "user_id";

alter table "public"."profiles" drop column "zipcode";

alter table "public"."profiles" add column "email" text;

alter table "public"."profiles" add column "name" text;

alter table "public"."transactions" drop column "frequency";

alter table "public"."transactions" add column "end_date" date;

alter table "public"."transactions" alter column "created_at" drop default;

alter table "public"."transactions" alter column "created_at" set data type date using "created_at"::date;

alter table "public"."transactions" alter column "payer_email" set not null;

CREATE UNIQUE INDEX profiles_email_key ON public.profiles USING btree (email);

alter table "public"."profiles" add constraint "profiles_email_key" UNIQUE using index "profiles_email_key";


