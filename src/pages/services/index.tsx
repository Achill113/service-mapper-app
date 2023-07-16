import * as Form from '@radix-ui/react-form';
import {useSession} from 'next-auth/react';
import Head from 'next/head';
import React from 'react';
import {api} from '~/utils/api';

export default function Services() {
  const serviceMutation = api.service.create.useMutation();
  const {data: sessionData} = useSession();

  const handleSumbit = (event: React.FormEvent<HTMLFormElement> | undefined) => {
    const data = Object.fromEntries(new FormData(event?.currentTarget));

    console.log(sessionData);

    if (sessionData && sessionData.user && sessionData.user.tenant) {
      serviceMutation.mutate({
        name: data.name!.toString(),
        version: data.version?.toString(),
        tenantId: sessionData.user.tenant.id,
      });
    }
  };

  return (
    <>
      <Head>
        <title>Service Mapper - Services</title>
      </Head>
      <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c]">
        <Form.Root onSubmit={handleSumbit}>
          <div className="container grid grid-cols-2 gap-12 px-4 py-16 ">
            <Form.Field className="FormField w-96" name="name">
              <div className="flex justify-between items-end">
                <Form.Label className="FormLabel text-base text-white">Name</Form.Label>
                <Form.Message className="FormMessage text-base text-red-600" match="valueMissing">
                  Service name is required
                </Form.Message>
                <Form.Message className="FormMessage text-base text-red-600" match="typeMismatch">
                  Please provide a valid name
                </Form.Message>
              </div>
              <Form.Control asChild required>
                <input className="Input rounded p-2" type="name" placeholder="Patient Service" required />
              </Form.Control>
            </Form.Field>
            <Form.Field className="FormField w-96" name="version">
              <div className="flex justify-between items-end">
                <Form.Label className="FormLabel text-base text-white">Version</Form.Label>
                <Form.Message className="FormMessage text-base text-red-600" match={(value, _) => !value || !value.match(/\d\.\d\.\d/g)}>
                  Please provide a valid version
                </Form.Message>
              </div>
              <Form.Control asChild>
                <input className="Input rounded p-2" type="version" placeholder="0.1.0" />
              </Form.Control>
            </Form.Field>
            <Form.Submit type='submit' className="rounded-full bg-white/10 px-10 py-3 font-semibold text-white no-underline transition hover:bg-white/20">
              Submit
            </Form.Submit>
          </div>
        </Form.Root>
      </main>
    </>
  );
}
