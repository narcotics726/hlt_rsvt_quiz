'use client';
import {
    Button,
    Divider,
    Input,
    Modal,
    ModalBody,
    ModalContent,
    ModalFooter,
    ModalHeader,
    Tooltip,
    useDisclosure,
} from '@nextui-org/react';
import { useState } from 'react';
import { useFormState } from 'react-dom';
import { customerAuth } from '@/app/actions';

export function CustomerLoginForm() {
    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const [inputPhone, setInputPhone] = useState('');

    const [state, formAction] = useFormState(customerAuth, '');

    return (
        <div className="flex flex-col items-center justify-center h-screen">
            <h1 className="text-2xl font-bold mb-4">
                Welcome to HLT Reservation
            </h1>
            <Input
                value={inputPhone}
                onChange={(e) => setInputPhone(e.target.value)}
                type="text"
                placeholder="Phone"
                className="w-64 mb-4"
            />
            <Button
                onPress={onOpen}
                className="w-64 mb-4 text-white bg-blue-500"
            >
                Make a reservation
            </Button>

            <Modal
                isOpen={isOpen}
                onOpenChange={onOpenChange}
                isDismissable={false}
                isKeyboardDismissDisabled={true}
            >
                <ModalContent>
                    {(onClose) => (
                        <>
                            <form action={formAction}>
                                <ModalHeader className="flex flex-col gap-1">
                                    Phone number verification
                                </ModalHeader>
                                <ModalBody>
                                    <Input
                                        name="phone"
                                        value={inputPhone}
                                        className="hidden"
                                    />
                                    <Input
                                        name="verificationCode"
                                        placeholder="Input the 6-digit verification code"
                                    />
                                    <div className="flex h-8 items-end space-x-1">
                                        {state && (
                                            <>
                                                <p className="text-sm text-red-500">
                                                    {state}
                                                </p>
                                            </>
                                        )}
                                    </div>
                                </ModalBody>
                                <ModalFooter>
                                    <Button
                                        color="danger"
                                        variant="light"
                                        onPress={onClose}
                                    >
                                        Close
                                    </Button>
                                    <Tooltip
                                        content="A new account will be created for you if you do not have one yet."
                                        placement="bottom-end"
                                    >
                                        <Input
                                            type="submit"
                                            value="Continue"
                                            color="primary"
                                        ></Input>
                                    </Tooltip>
                                </ModalFooter>
                            </form>
                        </>
                    )}
                </ModalContent>
            </Modal>
        </div>
    );
}
