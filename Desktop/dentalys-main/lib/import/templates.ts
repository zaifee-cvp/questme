// lib/import/templates.ts

export const CSV_TEMPLATE_CONTENT = `name,phone,email,notes,tags,is_first_time
Sarah Johnson,+14155551234,sarah.johnson@email.com,Interested in Botox,"botox,new client",true
Ahmad bin Ibrahim,+60123456789,ahmad.ibrahim@gmail.com,Referred by Dr. Lee,"referral,fillers",true
Yuki Tanaka,+819012345678,yuki.tanaka@email.jp,Regular client since 2023,"regular,laser",false`

export const JSON_TEMPLATE_CONTENT = JSON.stringify(
  [
    {
      name: 'Sarah Johnson',
      phone: '+14155551234',
      email: 'sarah.johnson@email.com',
      notes: 'Interested in Botox',
      tags: ['botox', 'new client'],
      is_first_time: true,
    },
    {
      name: 'Ahmad bin Ibrahim',
      phone: '+60123456789',
      email: 'ahmad.ibrahim@gmail.com',
      notes: 'Referred by Dr. Lee',
      tags: ['referral', 'fillers'],
      is_first_time: true,
    },
    {
      name: 'Yuki Tanaka',
      phone: '+819012345678',
      email: 'yuki.tanaka@email.jp',
      notes: 'Regular client since 2023',
      tags: ['regular', 'laser'],
      is_first_time: false,
    },
  ],
  null,
  2
)

export const VCF_EXAMPLE_CONTENT = `BEGIN:VCARD
VERSION:3.0
FN:Sarah Johnson
TEL;TYPE=CELL:+14155551234
EMAIL:sarah.johnson@email.com
NOTE:Interested in Botox
END:VCARD
BEGIN:VCARD
VERSION:3.0
FN:Ahmad bin Ibrahim
TEL;TYPE=CELL:+60123456789
EMAIL:ahmad.ibrahim@gmail.com
NOTE:Referred by Dr. Lee
END:VCARD`

export const FIELD_GUIDE: Array<{
  field: string
  required: boolean
  format: string
  example: string
}> = [
  {
    field: 'name',
    required: true,
    format: 'Text, minimum 2 characters',
    example: 'Sarah Johnson',
  },
  {
    field: 'phone',
    required: false,
    format: 'E.164 format with + prefix',
    example: '+14155551234',
  },
  {
    field: 'email',
    required: false,
    format: 'Valid email address',
    example: 'sarah@email.com',
  },
  {
    field: 'notes',
    required: false,
    format: 'Free text',
    example: 'Interested in Botox',
  },
  {
    field: 'tags',
    required: false,
    format: 'Comma-separated values',
    example: 'botox,new client',
  },
  {
    field: 'is_first_time',
    required: false,
    format: 'true/false, yes/no, or 1/0',
    example: 'true',
  },
]
