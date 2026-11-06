-- The assistant reads its public context from this row, so the default in code does not reach it.
update assistant_config
set public_context = replace(public_context, 'Email: mkhovrov01@gmail.com', E'Email: mkhovrov01@gmail.com\nTelegram: t.me/khovre'),
    updated_at = now()
where position('t.me/khovre' in public_context) = 0;
