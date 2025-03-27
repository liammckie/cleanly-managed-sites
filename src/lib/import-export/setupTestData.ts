
/**
 * Generates test data for development and testing
 * @returns Object with test data for different entity types
 */
export function setupTestData() {
  return {
    clients: [
      {
        name: 'Test Client 1',
        contact_name: 'John Doe',
        email: 'john@example.com',
        phone: '0412345678',
        address: '123 Test St',
        city: 'Sydney',
        state: 'NSW',
        postcode: '2000',
        status: 'active',
        notes: 'Test client for development'
      },
      {
        name: 'Test Client 2',
        contact_name: 'Jane Smith',
        email: 'jane@example.com',
        phone: '0487654321',
        address: '456 Demo Ave',
        city: 'Melbourne',
        state: 'VIC',
        postcode: '3000',
        status: 'pending',
        notes: 'Another test client'
      }
    ],
    sites: [
      {
        name: 'Test Site 1',
        client_id: '<REPLACE_WITH_REAL_CLIENT_ID>',
        address: '123 Site St',
        city: 'Sydney',
        state: 'NSW',
        postcode: '2000',
        status: 'active',
        email: 'site1@example.com',
        phone: '0412345678',
        representative: 'Site Manager',
        monthly_revenue: 5000,
        monthly_cost: 3000
      },
      {
        name: 'Test Site 2',
        client_id: '<REPLACE_WITH_REAL_CLIENT_ID>',
        address: '456 Venue Rd',
        city: 'Melbourne',
        state: 'VIC',
        postcode: '3000',
        status: 'pending',
        email: 'site2@example.com',
        phone: '0487654321',
        representative: 'Site Supervisor',
        monthly_revenue: 7500,
        monthly_cost: 4500
      }
    ],
    contractors: [
      {
        business_name: 'Test Contractor 1',
        contact_name: 'Bob Builder',
        email: 'bob@example.com',
        phone: '0412345678',
        address: '123 Contractor St',
        city: 'Sydney',
        state: 'NSW',
        postcode: '2000',
        abn: '12345678901',
        contractor_type: 'company',
        status: 'active',
        specialty: ['Cleaning', 'Maintenance'],
        notes: 'Test contractor'
      },
      {
        business_name: 'Test Contractor 2',
        contact_name: 'Alice Cleaner',
        email: 'alice@example.com',
        phone: '0487654321',
        address: '456 Service Rd',
        city: 'Melbourne',
        state: 'VIC',
        postcode: '3000',
        abn: '10987654321',
        contractor_type: 'individual',
        status: 'active',
        specialty: ['Cleaning'],
        notes: 'Another test contractor'
      }
    ],
    contracts: [
      {
        site_id: '<REPLACE_WITH_REAL_SITE_ID>',
        contract_details: {
          contractNumber: 'CNT-001',
          startDate: '2023-01-01',
          endDate: '2023-12-31',
          autoRenewal: true,
          renewalPeriod: '12',
          renewalNoticeDays: 30,
          value: 60000
        },
        notes: 'Test contract'
      }
    ],
    invoices: [
      {
        invoice_number: 'INV-001',
        client_id: '<REPLACE_WITH_REAL_CLIENT_ID>',
        site_id: '<REPLACE_WITH_REAL_SITE_ID>',
        amount: 5000,
        invoice_date: '2023-03-01',
        due_date: '2023-03-31',
        status: 'sent',
        notes: 'Test invoice',
        line_items: [
          {
            description: 'Monthly cleaning service',
            quantity: 1,
            unit_price: 4000
          },
          {
            description: 'Extra services',
            quantity: 2,
            unit_price: 500
          }
        ]
      }
    ]
  };
}
