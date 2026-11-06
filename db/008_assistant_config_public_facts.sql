-- The assistant reads its public context from this row, so the facts updated in code do not reach it.
update assistant_config
set public_context = replace(
      replace(public_context, 'Supported $400K+ in deal value', 'Supported $45K+ in deal value'),
      'Maksim Khovrov is an AI Automation Engineer', 'Maksim Khovrov is an AI / LLM Engineer'),
    updated_at = now()
where public_context like '%$400K+%' or public_context like '%is an AI Automation Engineer%';
