#!/bin/bash

# Script to create demo users for MedEquipTech
# This script should be run with elevated privileges (service role)

echo "Creating demo users for MedEquipTech..."

# Check if we're in the right directory
if [ ! -f "supabase/config.toml" ]; then
    echo "Error: Please run this script from the project root directory"
    exit 1
fi

# Check if Supabase CLI is installed
if ! command -v supabase &> /dev/null; then
    echo "Error: Supabase CLI is not installed. Please install it first."
    echo "Visit: https://supabase.com/docs/reference/cli"
    exit 1
fi

# Check if we have the required environment variables
if [ -z "$SUPABASE_SERVICE_ROLE_KEY" ]; then
    echo "Error: SUPABASE_SERVICE_ROLE_KEY environment variable is not set"
    echo "Please set it to your Supabase service role key"
    exit 1
fi

echo "Starting Supabase..."
supabase start

echo "Running migration to create demo users..."
supabase db reset --linked

echo "Demo users created successfully!"
echo ""
echo "Demo Account Credentials:"
echo "=========================="
echo "Technician: demo.technician@medequiptech.com / demo123"
echo "Trainer:   demo.trainer@medequiptech.com / demo123"
echo "MedSpa:    demo.medspa@medequiptech.com / demo123"
echo "Admin:     demo.admin@medequiptech.com / demo123"
echo ""
echo "You can now log in to the application using these credentials."
echo "Make sure to select the appropriate role on the login page."
